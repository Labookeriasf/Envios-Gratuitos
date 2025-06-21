import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 10000;

// Database connection
let db;
if (process.env.DATABASE_URL) {
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  // Initialize tables
  db.query(`
    CREATE TABLE IF NOT EXISTS institutions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      active BOOLEAN DEFAULT true,
      products TEXT[],
      collections TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(console.error);
}

// In-memory fallback
let institutions = [
  { id: 1, name: "Universidad Nacional", code: "UNI001", active: true, products: [], collections: [] }
];

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/institutions', async (req, res) => {
  try {
    if (db) {
      const result = await db.query('SELECT * FROM institutions ORDER BY created_at DESC');
      res.json(result.rows);
    } else {
      res.json(institutions);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.json(institutions);
  }
});

app.post('/api/institutions', async (req, res) => {
  try {
    const { name, selectedProducts = [], selectedCollections = [] } = req.body;
    const code = `INST${Date.now()}`;
    
    if (db) {
      const result = await db.query(
        'INSERT INTO institutions (name, code, products, collections) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, code, selectedProducts, selectedCollections]
      );
      res.json(result.rows[0]);
    } else {
      const newInstitution = {
        id: Date.now(),
        name,
        code,
        active: true,
        products: selectedProducts,
        collections: selectedCollections
      };
      institutions.push(newInstitution);
      res.json(newInstitution);
    }
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({ error: 'Error creating institution' });
  }
});

app.delete('/api/institutions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (db) {
      await db.query('DELETE FROM institutions WHERE id = $1', [id]);
    } else {
      institutions = institutions.filter(inst => inst.id !== parseInt(id));
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting institution:', error);
    res.status(500).json({ error: 'Error deleting institution' });
  }
});

app.post('/api/validate-discount', async (req, res) => {
  try {
    const { code } = req.body;
    let institution;
    
    if (db) {
      const result = await db.query('SELECT * FROM institutions WHERE code = $1 AND active = true', [code]);
      institution = result.rows[0];
    } else {
      institution = institutions.find(inst => inst.code === code && inst.active);
    }
    
    if (institution) {
      res.json({
        valid: true,
        institution: {
          id: institution.id,
          name: institution.name,
          code: institution.code
        }
      });
    } else {
      res.json({
        valid: false,
        message: "Código no válido o institución inactiva"
      });
    }
  } catch (error) {
    console.error('Error validating code:', error);
    res.status(500).json({ error: 'Error validating code' });
  }
});

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    let activeCount = 0;
    let totalCount = 0;
    
    if (db) {
      const activeResult = await db.query('SELECT COUNT(*) FROM institutions WHERE active = true');
      const totalResult = await db.query('SELECT COUNT(*) FROM institutions');
      activeCount = parseInt(activeResult.rows[0].count);
      totalCount = parseInt(totalResult.rows[0].count);
    } else {
      activeCount = institutions.filter(i => i.active).length;
      totalCount = institutions.length;
    }
    
    res.json({
      activeInstitutions: activeCount,
      totalDiscountCodes: totalCount,
      totalFreeShipments: 0,
      totalSavings: 0
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.json({
      activeInstitutions: 1,
      totalDiscountCodes: 1,
      totalFreeShipments: 0,
      totalSavings: 0
    });
  }
});

app.get('/api/dashboard/activity', (req, res) => {
  res.json([
    {
      type: "institution",
      description: "Nueva institución agregada",
      createdAt: new Date().toISOString(),
      status: true
    }
  ]);
});

// Shopify webhook endpoint
app.post('/api/webhook/shopify/order', (req, res) => {
  console.log('Shopify webhook received:', req.body);
  res.json({ received: true });
});

// Shopify API endpoints
app.get('/api/shopify/products', (req, res) => {
  res.json([
    { id: "1", title: "Libro de Matemáticas", handle: "libro-matematicas", status: "active" },
    { id: "2", title: "Libro de Historia", handle: "libro-historia", status: "active" }
  ]);
});

app.get('/api/shopify/collections', (req, res) => {
  res.json([
    { id: "1", title: "Libros Académicos", handle: "libros-academicos", products_count: 25 },
    { id: "2", title: "Material Escolar", handle: "material-escolar", products_count: 15 }
  ]);
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});