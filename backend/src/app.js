const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes'); // Changed to match casing
const authRoutes = require('./routes/authRoutes'); 


app.use(cors());
app.use(express.json());



module.exports = app;