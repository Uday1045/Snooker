const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema({
    frameNumber: Number,
    player1Score: Number,
    player2Score: Number,
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }
});

const matchSchema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    player1Name: String,
    player2Name: String,
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    scores: [Number],
    frames: [frameSchema]
}, { timestamps: true });

module.exports = mongoose.model('match', matchSchema);