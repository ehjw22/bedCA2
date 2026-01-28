
// =================================
// REQUIRE MODULES
// =================================
const express = require('express');
const challengesController = require('../controllers/challengesController');
const completionController = require('../controllers/completionsController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// =================================
// CREATING ROUTER
// =================================
const router = express.Router();

// =================================
// DEFINE ROUTES
// =================================

// 5. POST /challenges
// Handles creation of a new challenge by receiving request data
router.post('/', challengesController.addChallenges);

// 6. GET /challenges
// Retrieves all challenges from the database and returns them 
router.get('/', challengesController.getAllChallenge);

// 7. DELETE /challenges/{challenge_id}
// Deletes a challenge after verifying it exists, then removes related user completion records
router.delete('/:challenge_id', 
    challengesController.checkChallengeExist,
    challengesController.deleteChallengeById,
    completionController.deleteUserCompletion
);

// 8. PUT /challenges/{challenge_id}
// Updates an existing challenge after verifying it exists and checking creator ownership
router.put('/:challenge_id', 
    jwtMiddleware.verifyToken,
    challengesController.checkChallengeExist,
    challengesController.checkCreatorOfChallenge,
    challengesController.updateChallenge
);

module.exports = router;