// =================================
// REQUIRE MODULES
// =================================
const express = require('express');
const controller = require('../controllers/leaderBoardController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// =================================
// CREATING ROUTER
// =================================
const router = express.Router();

// =================================
// DEFINE ROUTES
// =================================

// GET /leaderboard
// Retrieves all users ranked by level for the leaderboard
router.get('/', 
    controller.getAllUserByLevel
);

module.exports = router;