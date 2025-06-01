const express = require('express');
const router = express.Router();
const { createPlayer, getAllPlayers } = require('../controllers/playerController');

router.post('/', createPlayer);
router.get('/', getAllPlayers);

module.exports = router;