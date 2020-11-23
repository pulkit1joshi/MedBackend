const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    ownerid: {
        type: mongoose.Schema.Types.ObjectId
    },
    followerscount: {
        type: Number,
        required: true
    },
    writersids: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    editorsids: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    description: {
        type: String,
        max: 200,
    },
    postids: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    image: {
        type: String,
    },
    theme: {
        type: Number
    },
    pages: {
        type: [String]
    },
    pinnedPostids: {
        type: [mongoose.Schema.Types.ObjectId]
    }
},{timestamps: true});


module.exports = mongoose.model('Publication', publicationSchema);