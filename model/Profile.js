const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    followerids: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    publicationids: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    followingids: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    about: {
        type: String,
        max: 200,
        default: "Hi! I am on medbook"
    },
    postids: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    image: {
        type: mongoose.Schema.Types.String,
        default: "image"
    },
    gender: {
        type: mongoose.Schema.Types.Number,
        default: 1
    },
    country: {
        type: mongoose.Schema.Types.String,
        default: 1
    },
    interests: {
        type: [mongoose.Schema.Types.Number],
        default: []
    }
},{timestamps: true});


module.exports = mongoose.model('Profile', profileSchema);