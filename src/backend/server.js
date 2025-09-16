import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


// Cek dan load data
const DATA_FILE = path.join(__dirname, '../../data/data.json');

if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    tasks: [],
    checkIns: {},
    scores: {
      house: 0,
      individuals: {}
    }
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// API Endpoints
app.get('/api/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/data', (req, res) => {
  try {
    const newData = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing data file:', error);
    res.status(500).json({ error: 'Failed to write data' });
  }
});

// Health check endpoint for container orchestration
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User credentials store - in production, use a database and hash passwords
const users = {
  'raif123': { name: 'Ra\'if', role: 'user' },
  'reza123': { name: 'Reza', role: 'user' },
  'yayat123': { name: 'Yayat', role: 'user' },
  'iza123': { name: 'Iza', role: 'user' },
  'zaki123': { name: 'Zaki', role: 'user' },
  'HRRZYA22': { name: null, role: 'admin' }
};

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  
  if (users[password]) {
    // Create a session token (in production use proper JWT or session management)
    const token = generateToken();
    const user = users[password];
    
    // Store token-user mapping (in production use Redis or a database)
    sessions[token] = {
      user: user.name,
      role: user.role,
      timestamp: Date.now()
    };
    
    res.json({
      success: true,
      token,
      user: user.name
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Password salah. Silakan coba lagi.'
    });
  }
});

// Session validation endpoint
app.get('/api/auth/validate', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token && sessions[token]) {
    res.json({
      authenticated: true,
      user: sessions[token].user
    });
  } else {
    res.status(401).json({
      authenticated: false
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token && sessions[token]) {
    delete sessions[token];
  }
  
  res.json({ success: true });
});

// Helper function to generate a token
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// In-memory session store (use Redis or a database in production)
const sessions = {};

// For production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Frontend served at http://localhost:${PORT}`);
  }
});