// =================================
// REQUIRE MODULES
// =================================
const express = require('express');
const userRoutes = require('./userRoutes');
const challengesRoutes = require('./challengesRoutes');
const completionRoutes = require('./completionRoutes');
const leaderBoardRoutes = require('./leaderBoardRoutes');
const planetRoutes = require('./planetRoutes');
const plantRoutes = require('./plantRoutes');

// =================================
// CREATING ROUTER
// =================================
const router = express.Router();

// =================================
// DEFINE ROUTES
// =================================
router.use('/user', userRoutes);
router.use('/challenges', challengesRoutes);
router.use('/challenges', completionRoutes);
router.use('/leaderboard', leaderBoardRoutes);
router.use('/planets', planetRoutes);
router.use('/plants', plantRoutes);

module.exports = router