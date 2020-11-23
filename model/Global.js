const mongoose = require('mongoose');
const globalSchema = new mongoose.Schema({
    usercount: {
        type: Number,
        required: true
    },
    postcount: {
        type: Number,
        required: true
    },
    publicationcount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Global', globalSchema);