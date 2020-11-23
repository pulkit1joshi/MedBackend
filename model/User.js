const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    lastname: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    username: {
        type: String,
        required: true,
        min: 6,
        max: 20,
        index: true,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        index: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: Boolean,
        default: false
    }
},{timestamps: true});


module.exports = mongoose.model('User', userSchema);