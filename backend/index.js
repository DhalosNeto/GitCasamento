import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let db = null;
try {
  const serviceAccountPath = path.join(__dirname, 'service-account.json');
  if (fs.existsSync(serviceAccountPath)) {
    console.log("Found service-account.json, initializing Firebase...");
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log("Using FIREBASE_SERVICE_ACCOUNT env var for Firebase...");
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT or service-account.json not found. Firestore features will not work.");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error.message);
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Admin Endpoints ---

// List all families (Admin only)
app.get('/api/admin/families', async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not initialized" });
  try {
    const snapshot = await db.collection('families').get();
    const families = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(families);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new family (Admin only)
app.post('/api/admin/family', async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not initialized" });
  try {
    const familyData = req.body;
    const docRef = await db.collection('families').add({
      ...familyData,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Guest Endpoints ---

// Get family by ID (Unique Link access)
app.get('/api/family/:id', async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not initialized" });
  try {
    const doc = await db.collection('families').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Family not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update RSVP (Guest)
app.put('/api/family/:id/rsvp', async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not initialized" });
  try {
    const { members, messageToCouple } = req.body;

    // Build update object dynamically to prevent passing undefined to Firestore
    const updateData = {
      members,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (messageToCouple !== undefined) {
      updateData.messageToCouple = messageToCouple;
    }

    await db.collection('families').doc(req.params.id).update(updateData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
