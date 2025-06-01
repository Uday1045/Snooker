const Player = require('../models/player');

exports.createPlayer = async (req, res) => {
    try {
        // Check if player already exists
        let player = await Player.findOne({ name: req.body.name });
        
        if (player) {
            return res.json(player); // Return existing player
        }

        // Create new player if doesn't exist
        player = new Player({ name: req.body.name });
        await player.save();
        
        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create player',
            error: error.message
        });
    }
};

exports.getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find().sort('name');
        res.json(players);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get players',
            error: error.message
        });
    }
};