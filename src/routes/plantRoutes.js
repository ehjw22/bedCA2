// =================================
// REQUIRE MODULES
// =================================
const express = require('express');
const controller = require('../controllers/plantController');

// =================================
// CREATING ROUTER
// =================================
const router = express.Router();

// =================================
// DEFINE ROUTES
// =================================

// GET /plant
// Retrieves all available plants
router.use('/', controller.getAllPlants);

module.exports = router;