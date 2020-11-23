const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    writerid: {
        type: mongoose.Schema.Types.ObjectId
    },
    claps: {
        type: Number,
        required: true
    },
    clapersIds: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    editorsids: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    content: {
        title: {
            type: String,
            max: 100,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        description: {
            type: String,
            max: 200,
        },

    },
    tagslist: {
        type: [String],
        validate: [arrayLimit, '5 tags are only allowed']
    },
    imageUrl: {
        type: String,
        required: true
    }
},{timestamps: true});

function arrayLimit(val)
{
    return val.length <= 5;
}
module.exports = mongoose.model('Article', articleSchema);