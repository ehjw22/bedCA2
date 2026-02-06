
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
router.post('/', 
    jwtMiddleware.verifyToken,
    challengesController.addChallenges
);

// 6. GET /challenges
// Retrieves all challenges from the database and returns them 
router.get('/', challengesController.getAllChallenge);

router.post("/similarChallenges", 
    challengesController.getSimilarChallenges
)

// 7. DELETE /challenges/{challenge_id}
// Deletes a challenge after verifying it exists, then removes related user completion records
router.delete('/:challenge_id', 
    jwtMiddleware.verifyToken,
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

// Retrieves a specific challenge information
router.get("/:challenge_id", 
    jwtMiddleware.verifyToken,
    challengesController.getChallengeById
);

module.exports = router;