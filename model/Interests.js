const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    identifier: 
    {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
    }
},{timestamps: true});


module.exports = mongoose.model('Tag', tagSchema);