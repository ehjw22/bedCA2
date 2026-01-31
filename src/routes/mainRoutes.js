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
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');

// =================================
// CREATING ROUTER
// =================================
const router = express.Router();

// =================================
// DEFINE ROUTES
// =================================
router.post("/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, userController.confirmLogin, jwtMiddleware.sendToken);
router.post("/register", userController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, userController.register, userController.unlockPlanetsFirstTime, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.use('/user', userRoutes);
router.use('/challenges', challengesRoutes);
router.use('/challenges', completionRoutes);
router.use('/leaderboard', leaderBoardRoutes);
router.use('/planets', planetRoutes);
router.use('/plants', plantRoutes);

module.exports = router