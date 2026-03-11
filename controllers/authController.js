const db  = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Simple login - stores plain password in DB (easy to test)
// To use bcrypt later: just change the comparison line
async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password are required.' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid username or password.' });

    const user = rows[0];

    // Plain text comparison (simple version)
    if (password !== user.password)
      return res.status(401).json({ message: 'Invalid username or password.' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role, ward: user.ward }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = { login };
