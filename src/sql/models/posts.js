const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        unique: true,
    },
    introducao: {
        type: String,
        required: true,
    },
    desenvolvimento: {
        type: String,
        required: true,
    },
    conclusao: {
        type: String,
        required: true,
    },
    data: {
        type: Date,
        default: Date.now,
    },
    autor: {
        type: String,
        required: true,
    },
    images: [
        {
            data: Buffer,
            contentType: String,
        },
    ],
});

const Post = mongoose.model('Post', postSchema, 'posts', { versionKey: false });  

module.exports = Post;
