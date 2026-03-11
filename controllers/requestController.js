const db = require('../config/db');

async function getRequests(req, res) {
  try {
    let query, params;
    if (req.user.role === 'admin') {
      query = `SELECT br.*, u.username, u.full_name, e.name AS equipment_name
               FROM borrow_requests br
               JOIN users u ON br.user_id = u.id
               JOIN equipment e ON br.equipment_id = e.id
               ORDER BY br.created_at DESC`;
      params = [];
    } else {
      query = `SELECT br.*, e.name AS equipment_name
               FROM borrow_requests br
               JOIN equipment e ON br.equipment_id = e.id
               WHERE br.user_id = ?
               ORDER BY br.created_at DESC`;
      params = [req.user.id];
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}

async function createRequest(req, res) {
  const { equipment_id, qty, ward, borrow_date, return_date, note } = req.body;
  if (!equipment_id || !qty || !ward || !borrow_date || !return_date)
    return res.status(400).json({ message: 'All required fields must be filled.' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [equip] = await conn.query('SELECT available_qty FROM equipment WHERE id = ? FOR UPDATE', [equipment_id]);
    if (equip.length === 0) { await conn.rollback(); return res.status(404).json({ message: 'Equipment not found.' }); }
    if (equip[0].available_qty < qty) { await conn.rollback(); return res.status(400).json({ message: `Only ${equip[0].available_qty} available.` }); }

    const year = new Date().getFullYear();
    const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM borrow_requests');
    const requestNo = `REQ-${year}-${String(count + 1).padStart(4, '0')}`;

    const [result] = await conn.query(
      'INSERT INTO borrow_requests (request_no, user_id, equipment_id, qty, ward, borrow_date, return_date, note) VALUES (?,?,?,?,?,?,?,?)',
      [requestNo, req.user.id, equipment_id, qty, ward, borrow_date, return_date, note || null]
    );
    await conn.query('UPDATE equipment SET available_qty = available_qty - ? WHERE id = ?', [qty, equipment_id]);
    await conn.commit();
    res.status(201).json({ message: 'Request submitted.', request_no: requestNo, id: result.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.' });
  } finally {
    conn.release();
  }
}

async function updateRequestStatus(req, res) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only.' });
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['approved', 'rejected', 'returned', 'overdue'];
  if (!valid.includes(status)) return res.status(400).json({ message: `Status must be: ${valid.join(', ')}` });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM borrow_requests WHERE id = ?', [id]);
    if (rows.length === 0) { await conn.rollback(); return res.status(404).json({ message: 'Request not found.' }); }
    const request = rows[0];
    if ((status === 'returned' || status === 'rejected') && request.status === 'pending') {
      await conn.query('UPDATE equipment SET available_qty = available_qty + ? WHERE id = ?', [request.qty, request.equipment_id]);
    }
    await conn.query(
      'UPDATE borrow_requests SET status=?, approved_by=?, approved_at=NOW(), actual_return=? WHERE id=?',
      [status, req.user.id, status === 'returned' ? new Date() : null, id]
    );
    await conn.commit();
    res.json({ message: `Request marked as ${status}.` });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.' });
  } finally {
    conn.release();
  }
}

module.exports = { getRequests, createRequest, updateRequestStatus };
