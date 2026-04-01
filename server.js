const express = require('express');
const cors = require('cors');
const path = require("path");
require('dotenv').config();

const app = express();  // create app first

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());
app.use(express.static("public")); // now it's safe to use app


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