const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    totalFrames: {
        type: Number,
        default: 0
    },
    framesWon: {
        type: Number,
        default: 0
    },
    highestBreak: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);