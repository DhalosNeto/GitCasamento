const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

// Initialize Firebase Admin (Using service account or env)
let db = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log("Using FIREBASE_SERVICE_ACCOUNT env var for Firebase...");
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
  } else {
    // Attempt local file for local dev
    const fs = require('fs');
    const path = require('path');
    const saPath = path.join(__dirname, '..', 'service-account.json');
    if (fs.existsSync(saPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      db = admin.firestore();
    } else {
       console.warn("FIREBASE credentials not found.");
    }
  }
} catch (error) {
  console.error("Error initializing Firebase:", error.message);
}

// Initialize Supabase for Storage
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const port = process.env.PORT || 3001;

// Security Constants
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'casamento2026';
const JWT_SECRET = process.env.JWT_SECRET || 'wedding-secret-ultra-secure-2026-dynamic';

// --- Security Middleware ---
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Restricted CORS
const frontendURL = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: frontendURL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- Authentication Middleware ---
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Sessão expirada ou token inválido.' });
  }
};

// --- Multer Configuration (Memory Storage for Supabase) ---
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// --- API Routes ---

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Senha incorreta.' });
});

// Admin: Families
app.get('/api/admin/families', authenticateAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('families').get();
    const families = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(families);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/family', authenticateAdmin, async (req, res) => {
  try {
    const docRef = await db.collection('families').add({
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/family/:id', authenticateAdmin, async (req, res) => {
  try {
    await db.collection('families').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Upload to Supabase Storage
app.post('/api/admin/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;

    const { data, error } = await supabase.storage
      .from('wedding-gifts')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ error: 'Falha ao fazer upload da imagem no Supabase.' });
    }

    const { data: publicData } = supabase.storage
      .from('wedding-gifts')
      .getPublicUrl(fileName);

    res.json({ imageUrl: publicData.publicUrl });
  } catch (error) {
    console.error("Upload process error:", error);
    res.status(500).json({ error: 'Erro interno durante upload.' });
  }
});

// Admin: Gifts
app.get('/api/admin/gifts', authenticateAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('gifts').get();
    res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/gift', authenticateAdmin, async (req, res) => {
  try {
    const docRef = await db.collection('gifts').add({
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/gift/:id', authenticateAdmin, async (req, res) => {
  try {
    await db.collection('gifts').doc(req.params.id).update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/gift/:id', authenticateAdmin, async (req, res) => {
  try {
    const docRef = db.collection('gifts').doc(req.params.id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      // Remove image from Supabase Storage if it exists
      if (data.imageUrl && data.imageUrl.includes('supabase.co')) {
        const parts = data.imageUrl.split('/wedding-gifts/');
        if (parts.length === 2) {
          const fileName = parts[1];
          const { error } = await supabase.storage.from('wedding-gifts').remove([fileName]);
          if (error) {
             console.error("Error deleting from supabase:", error);
          }
        }
      }
      await docRef.delete();
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Guest Endpoints
app.get('/api/gifts', async (req, res) => {
  try {
    const snapshot = await db.collection('gifts').get();
    res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/family/:id', async (req, res) => {
  try {
    const doc = await db.collection('families').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Família não encontrada." });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/family/code/:code', async (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();
    const snapshot = await db.collection('families').where('accessCode', '==', code).get();
    if (snapshot.empty) return res.status(404).json({ error: "Família não encontrada." });
    const doc = snapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/family/:id/rsvp', async (req, res) => {
  try {
    await db.collection('families').doc(req.params.id).update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', environment: 'production-hybrid' }));

// Start Server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
