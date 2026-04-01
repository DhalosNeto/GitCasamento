import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Security Constants
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'casamento2026';
const JWT_SECRET = process.env.JWT_SECRET || 'wedding-secret-ultra-secure-2026';

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

// --- Security Middleware ---
app.use(helmet({
  crossOriginResourcePolicy: false, // Permite carregar imagens do mesmo servidor
}));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Global Rate Limiter (Prevents DDoS and spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Admin Authentication Middleware
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

const FAMILIES_FILE = path.join(__dirname, 'families.json');

const getLocalFamilies = () => {
  if (!fs.existsSync(FAMILIES_FILE)) return [];
  try {
    const data = fs.readFileSync(FAMILIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading local families:", error);
    return [];
  }
};

const saveLocalFamilies = (families) => {
  try {
    fs.writeFileSync(FAMILIES_FILE, JSON.stringify(families, null, 2));
  } catch (error) {
    console.error("Error saving local families:", error);
  }
};

const GIFTS_FILE = path.join(__dirname, 'gifts.json');

const getLocalGifts = () => {
  if (!fs.existsSync(GIFTS_FILE)) return [];
  try {
    const data = fs.readFileSync(GIFTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading local gifts:", error);
    return [];
  }
};

const saveLocalGifts = (gifts) => {
  try {
    fs.writeFileSync(GIFTS_FILE, JSON.stringify(gifts, null, 2));
  } catch (error) {
    console.error("Error saving local gifts:", error);
  }
};

// --- Admin Endpoints ---

// Login (Secure password exchange for JWT)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Senha incorreta.' });
});

// TEMPORARY DEBUG ROUTE
app.get('/api/debug/families', async (req, res) => {
  try {
    if (db) {
       const snapshot = await db.collection('families').get();
       res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } else {
       res.json(getLocalFamilies());
    }
  } catch (e) { res.json({ error: e.message }); }
});

// List all families (Admin only)
app.get('/api/admin/families', authenticateAdmin, async (req, res) => {
  try {
    if (db) {
      const snapshot = await db.collection('families').get();
      const families = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(families);
    } else {
      // Local JSON fallback
      res.json(getLocalFamilies());
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new family (Admin only)
app.post('/api/admin/family', authenticateAdmin, async (req, res) => {
  try {
    const familyData = req.body;
    if (db) {
      const docRef = await db.collection('families').add({
        ...familyData,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      res.json({ id: docRef.id });
    } else {
      // Local JSON fallback
      const families = getLocalFamilies();
      const newFamily = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 12),
        ...familyData,
        createdAt: new Date().toISOString()
      };
      families.push(newFamily);
      saveLocalFamilies(families);
      res.json({ id: newFamily.id });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a family (Admin only)
app.delete('/api/admin/family/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (db) {
      await db.collection('families').doc(id).delete();
      res.json({ success: true });
    } else {
      // Local JSON fallback
      let families = getLocalFamilies();
      families = families.filter(f => f.id !== id);
      saveLocalFamilies(families);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Admin Upload Endpoint ---
app.post('/api/admin/upload', authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// --- Gift Management Endpoints (Admin) ---
app.post('/api/admin/gift', authenticateAdmin, async (req, res) => {
  try {
    const giftData = req.body;
    if (db) {
      const docRef = await db.collection('gifts').add({
        ...giftData,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      res.json({ id: docRef.id });
    } else {
      const gifts = getLocalGifts();
      const newGift = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 12),
        ...giftData,
        createdAt: new Date().toISOString()
      };
      gifts.push(newGift);
      saveLocalGifts(gifts);
      res.json({ id: newGift.id });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/gift/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (db) {
      await db.collection('gifts').doc(id).delete();
      res.json({ success: true });
    } else {
      let gifts = getLocalGifts();
      gifts = gifts.filter(g => g.id !== id);
      saveLocalGifts(gifts);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/gift/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (db) {
      await db.collection('gifts').doc(id).update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      res.json({ success: true });
    } else {
      let gifts = getLocalGifts();
      const index = gifts.findIndex(g => g.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Gift not found" });
      }
      gifts[index] = {
        ...gifts[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      saveLocalGifts(gifts);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Guest Gift Endpoints ---

app.get('/api/gifts', async (req, res) => {
  try {
    if (db) {
      const snapshot = await db.collection('gifts').get();
      const gifts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(gifts);
    } else {
      res.json(getLocalGifts());
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Guest Endpoints ---

// Get family by ID (Unique Link access)
app.get('/api/family/:id', async (req, res) => {
  try {
    if (db) {
      const doc = await db.collection('families').doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Family not found" });
      }
      res.json({ id: doc.id, ...doc.data() });
    } else {
      // Local JSON fallback
      const families = getLocalFamilies();
      const family = families.find(f => f.id === req.params.id);
      if (!family) {
        return res.status(404).json({ error: "Family not found" });
      }
      res.json(family);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get family by Access Code (Alternative to ID)
app.get('/api/family/code/:code', async (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();
    console.log(`Searching for family with code: [${code}]`);
    
    if (db) {
      const snapshot = await db.collection('families').where('accessCode', '==', code).get();
      if (snapshot.empty) {
        console.log(`No family found in Firestore for code: ${code}`);
        return res.status(404).json({ error: "Família não encontrada com este código." });
      }
      const doc = snapshot.docs[0];
      console.log(`Found family in Firestore: ${doc.id}`);
      res.json({ id: doc.id, ...doc.data() });
    } else {
      // Local JSON fallback
      const families = getLocalFamilies();
      const family = families.find(f => f.accessCode === code);
      if (!family) {
        return res.status(404).json({ error: "Família não encontrada com este código." });
      }
      res.json(family);
    }
  } catch (error) {
    console.error(`Error searching code ${req.params.code}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update RSVP (Guest)
app.put('/api/family/:id/rsvp', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (db) {
      const firestoreUpdate = {
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      await db.collection('families').doc(id).update(firestoreUpdate);
      res.json({ success: true });
    } else {
      // Local JSON fallback
      let families = getLocalFamilies();
      const index = families.findIndex(f => f.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Family not found" });
      }
      families[index] = {
        ...families[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      saveLocalFamilies(families);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    database: db ? 'firebase' : 'local-json'
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
