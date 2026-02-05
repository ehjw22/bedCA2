// =================================
// REQUIRE MODULES
// =================================
const express = require('express');
const controller = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

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
router.get("/token", 
    jwtMiddleware.verifyToken,
    controller.getUserById
);

// 4. PUT /users/{user_id}
// Updates user details after validating user identity
router.put("/token", 
    // controller.checkUserIdExist,
    jwtMiddleware.verifyToken,
    controller.checkNameExist,
    // controller.checkPassword,
    controller.updateUser,
    controller.sendResponse
);

// GET /users/{user_id}/badges
// Retrieves all badges earned by the user
router.get("/token/badges", 
    jwtMiddleware.verifyToken,
    controller.getAllBadges
);

// GET /users/{user_id}/planets
// Retrieves all planets unlocked by the user
router.get("/token/planets", 
    jwtMiddleware.verifyToken,
    controller.getAllPlanets
);

// GET /users/{user_id}/plants
// Retrieves all plants owned by the user

router.get("/token/plants/:planet_id",
    jwtMiddleware.verifyToken,
    controller.checkPlanetIdExist,
    controller.getAllPlants
);

router.get("/token/boughtPlants", 
    jwtMiddleware.verifyToken,
    controller.getUserBoughtPlants
)
// GET /users/{user_id}/completions
// Retrieves all challenges completed by the user
router.get('/token/completions',
    jwtMiddleware.verifyToken,
    controller.getCompletedChallenges
);

// DELETE /users/{user_id}/plants/{plant_id}
// Removes a plant owned by the user
router.delete('/token/plants/:user_plant_id',
    jwtMiddleware.verifyToken,
    // controller.checkPlantIdExist,
    // controller.checkUserOwnsPlant,
    controller.deleteUserOwnedPlant
);

// POST /users/{user_id}/plants/{plant_id}/plant
// Plants a owned plant on a specific planet
router.post('/token/plants/:plant_id/plant', 
    jwtMiddleware.verifyToken,
    controller.checkPlantIdExist,
    controller.checkPlanetIdExist,
    controller.checkUserOwnsPlanet,
    controller.checkUserOwnsPlant,
    controller.plantPlant
);



// POST /{user_id}/plants/{plant_id}/buy
// Allows a user to purchase a plant
router.post('/token/plants/:plant_id/buy', 
    jwtMiddleware.verifyToken,
    controller.checkPlantIdExist,
    controller.checkUserCanBuyPlant,
    controller.buyPlant
);

router.get("/token/challenges",
    jwtMiddleware.verifyToken,
    controller.getUserCreatedChallenges
)
module.exports = router