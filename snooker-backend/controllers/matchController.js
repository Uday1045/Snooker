const Match = require('../models/Match');
const Player = require('../models/player');

exports.createMatch = async (req, res) => {
    try {
        const { player1, player2, player1Name, player2Name, winner, scores, frames } = req.body;

        const match = new Match({
            player1,
            player2,
            player1Name,
            player2Name,
            winner,
            scores,
            frames
        });

        await match.save();

        // Update player statistics
        await Player.findByIdAndUpdate(winner, {
            $inc: { framesWon: 1, totalFrames: 1 }
        });

        await Player.findByIdAndUpdate(
            winner === player1 ? player2 : player1,
            { $inc: { totalFrames: 1 } }
        );

        res.status(201).json(match);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create match',
            error: error.message
        });
    }
};

exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('player1', 'name')
            .populate('player2', 'name')
            .populate('winner', 'name')
            .sort('-createdAt');
        res.json(matches);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get matches',
            error: error.message
        });
    }
};