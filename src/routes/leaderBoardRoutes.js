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
router.get('/challenge', 
    controller.getAllUserByChallengesCompleted
);

router.get('/byExp',
    controller.getAllUserByExp
);

router.get('/byPlantPlanted',
    controller.getAllUserByPlantedPlants
)
module.exports = router;