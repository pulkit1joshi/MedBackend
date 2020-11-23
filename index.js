const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const adminRoute = require('./routes/admin');

// Connect database
dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },() => {
    console.log("Connected to database");
});

app.use(express.json());
// Route MWares

app.use('/api/user', authRoute);
app.use('/api/p/', profileRoute);
app.use('/api/admin/', adminRoute);
app.get('/', (req, res) =>
{
    res.sendStatus(200);
});


app.listen(process.env.PORT || 3000, () =>console.log('Server is up and running'));