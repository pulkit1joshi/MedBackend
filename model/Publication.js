const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    displayname: {
        type: mongoose.Schema.Types.String,
        required: true
    },
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
    draftids: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    image: {
        type: mongoose.Schema.Types.String,
    },
    theme: {
        type: mongoose.Schema.Types.Number
    },
    pages: {
        type: [mongoose.Schema.Types.String]
    },
    pinnedPostids: {
        type: [mongoose.Schema.Types.ObjectId]
    }
},{timestamps: true});


module.exports = mongoose.model('Publication', publicationSchema);