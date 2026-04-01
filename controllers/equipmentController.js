const db = require('../config/db');

async function getAllEquipment(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT id, name, description, image_url, total_qty, available_qty, category FROM equipment WHERE is_active = TRUE ORDER BY name'
    );
    res.set('Cache-Control', 'no-store');
    res.json(rows);
    console.log("GET /equipment called");
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}

async function getEquipmentById(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM equipment WHERE id = ? AND is_active = TRUE', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Equipment not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}

async function createEquipment(req, res) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only.' });
  const { name, description, image_url, total_qty, category } = req.body;
  if (!name || !total_qty) return res.status(400).json({ message: 'Name and total_qty required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO equipment (name, description, image_url, total_qty, available_qty, category) VALUES (?,?,?,?,?,?)',
      [name, description, image_url, total_qty, total_qty, category]
    );
    res.status(201).json({ message: 'Equipment created.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}

async function updateQuantity(req, res) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only.' });
  }

  const { id } = req.params;
  const { change } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT total_qty, available_qty FROM equipment WHERE id = ?',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Not found' });
    }

    let total = rows[0].total_qty + change;
    let available = rows[0].available_qty + change;

    if (total < 0 || available < 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    await db.query(
      'UPDATE equipment SET total_qty = ?, available_qty = ? WHERE id = ?',
      [total, available, id]
    );

    res.json({ message: 'Updated' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}
module.exports = { getAllEquipment, getEquipmentById, createEquipment, updateQuantity };
