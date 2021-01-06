const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    published: {
        type: Boolean,
        default: false
    },
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
        title: {
            type: mongoose.Schema.Types.String,
            max: 100,
            required: true
        },
        body: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        description: {
            type: mongoose.Schema.Types.String,
            max: 200,
        },

    pid: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    tagslist: {
        type: [mongoose.Schema.Types.String],
        validate: [arrayLimit, '5 tags are only allowed']
    },
    imageUrl: {
        type: mongoose.Schema.Types.String,
        required: true
    }
},{timestamps: true});

function arrayLimit(val)
{
    return val.length <= 5;
}
module.exports = mongoose.model('Article', articleSchema);
