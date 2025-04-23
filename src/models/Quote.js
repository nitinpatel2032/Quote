const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'Unknown'
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
        }
    },
    toObject: {
        transform: function (doc, ret) {
            delete ret.__v;
        }
    }
}
);

module.exports = mongoose.model('Quote', quoteSchema);