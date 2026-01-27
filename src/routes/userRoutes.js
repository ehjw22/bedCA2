// =================================
// REQUIRE MODULES
// =================================
const express = require('express');
const controller = require('../controllers/userController');

// =================================
// CREATING ROUTER
// =================================
const router = express.Router();

// =================================
// DEFINE ROUTES
// =================================

// 1. POST /users
// Creates a new user account
router.post("/", 
    controller.checkNameExist,
    controller.addUser
);

// 2. GET /users
// Retrieves all users
router.get("/", controller.getAllUsers);

// 3. GET /users/{user_id}
// Retrieves a specific user by user ID
router.get("/:user_id", controller.getUserById);

// 4. PUT /users/{user_id}
// Updates user details after validating user identity
router.put("/:user_id", 
    controller.checkUserIdExist,
    controller.checkNameExist,
    controller.checkPassword,
    controller.updateUser,
    controller.sendResponse
);

// // POST /users/login
// // Authenticates a user and records login activity
// router.post("/login", 
//     controller.getUserId,
//     controller.checkPassword,
//     controller.confirmLogin
// );

// GET /users/{user_id}/badges
// Retrieves all badges earned by the user
router.get("/:user_id/badges", 
    controller.checkUserIdExist,
    controller.getAllBadges
);

// GET /users/{user_id}/planets
// Retrieves all planets unlocked by the user
router.get("/:user_id/planets", 
    controller.checkUserIdExist,
    controller.getAllPlanets
);

// GET /users/{user_id}/plants
// Retrieves all plants owned by the user
router.get("/:user_id/plants",
    controller.checkUserIdExist,
    controller.getAllPlants
);

router.get("/:user_id/boughtPlants", 
    controller.checkUserIdExist,
    controller.getUserBoughtPlants
)
// GET /users/{user_id}/completions
// Retrieves all challenges completed by the user
router.get('/:user_id/completions',
    controller.checkUserIdExist,
    controller.getCompletedChallenges
);

// POST /users/{user_id}/plants/{plant_id}/plant
// Plants a owned plant on a specific planet
router.post('/:user_id/plants/:plant_id/plant', 
    controller.checkUserIdExist,
    controller.checkPlantIdExist,
    controller.checkPlanetIdExist,
    controller.checkUserOwnsPlanet,
    controller.checkUserOwnsPlant,
    controller.plantPlant
);

// DELETE /users/{user_id}/plants/{plant_id}
// Removes a plant owned by the user
router.delete('/:user_id/plants/:plant_id',
    controller.checkUserIdExist,
    controller.checkPlantIdExist,
    controller.checkUserOwnsPlant,
    controller.deleteUserOwnedPlant
);

// POST /{user_id}/plants/{plant_id}/buy
// Allows a user to purchase a plant
router.post('/:user_id/plants/:plant_id/buy', 
    controller.checkUserIdExist,
    controller.checkPlantIdExist,
    controller.checkUserCanBuyPlant,
    controller.buyPlant
);

router.get("/:user_id/challenges",
    controller.checkUserIdExist,
    controller.getUserCreatedChallenges
)
module.exports = router