// backend/app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const path = require('path');  // Add this line

const app = express();
const PORT = process.env.PORT || 3000;
// Load environment variables from .env
require('dotenv').config();

// Use the MongoDB URI stored in the .env file
const mongoURI = process.env.MONGO_URI;

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(bodyParser.json());
app.use('/api', routes); // Use routes defined in routes.js
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static files from frontend directory

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
