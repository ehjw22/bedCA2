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

// Retrieves all users ranked by level for the leaderboard
router.get('/challenge', 
    controller.getAllUserByChallengesCompleted
);

// Retrieves all users ranked by their experience
router.get('/byExp',
    controller.getAllUserByExp
);

// Retrieve all users ranked by the number of plants they have planted
router.get('/byPlantPlanted',
    controller.getAllUserByPlantedPlants
)
module.exports = router;