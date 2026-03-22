const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FlowSaarthi Backend is running' });
});

// Import routes
const uploadRoutes = require('./routes/upload');
app.use('/api', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
