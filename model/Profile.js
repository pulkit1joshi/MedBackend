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
        default: "https://d11a6trkgmumsb.cloudfront.net/original/3X/d/8/d8b5d0a738295345ebd8934b859fa1fca1c8c6ad.jpeg"
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
