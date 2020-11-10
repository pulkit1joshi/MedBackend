const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// Connect database
dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },() => {
    console.log("Connected to database");
});

app.use(express.json());
// Route MWares

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () =>console.log('Server is up and running'));