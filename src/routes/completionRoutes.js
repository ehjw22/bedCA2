// =================================
// REQUIRE MODULES
// =================================
const express = require('express');
const completionController = require('../controllers/completionsController');
const userController = require('../controllers/userController');
const challengeController = require('../controllers/challengesController');

// =================================
// CREATING ROUTER
// =================================
const router = express.Router();

// =================================
// DEFINE ROUTES
// =================================

// 9. POST/challenges/{challegne_id}/
// Creates a completion record for a specific challenge, updates user progress, and returns the completion details
router.post('/:challenge_id', 
    userController.checkUserExist,
    challengeController.checkChallengeExist,
    completionController.createCompletionRecord,
    userController.updatePointsNExp,
    userController.updateLevel,
    userController.unlockPlanets,
    userController.unlockBadges,
    completionController.sendResponse
);

// 10. GET /challenges/{challenge_id}
// Retrieves all user completion records for a specific challenge
router.get('/:challenge_id',
    completionController.getUserCompletionByChallengeId
);

module.exports = router;