const express = require('express');
const router = express.Router();
const { createMatch, getAllMatches } = require('../controllers/matchController');

router.post('/', createMatch);
router.get('/', getAllMatches);

module.exports = router;