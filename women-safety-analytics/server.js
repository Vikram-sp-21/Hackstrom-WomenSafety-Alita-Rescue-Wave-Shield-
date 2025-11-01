require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const apiRoutes = require('./routes/api');

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

