const express = require('express');
const cors = require('cors');
const path = require("path");
require('dotenv').config();
app.use(express.static("public"));

const app = express();

app.use(cors());
app.use(express.json());

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "medical-equipment.html"));
});

// API routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/requests',  require('./routes/requests'));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', message: 'MedBorrow API running 🏥' })
);

// 404 handler
app.use((req, res) =>
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});