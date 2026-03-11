const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/requests',  require('./routes/requests'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'MedBorrow API running 🏥' }));
app.use((req, res) => res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
