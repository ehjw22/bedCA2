// =================================
// REQUIRE MODULES
// =================================
const express = require('express');
const controller = require('../controllers/planetController');

// =================================
// CREATING ROUTER
// =================================
const router = express.Router();

// =================================
// DEFINE ROUTES
// =================================

// GET /planets
// Retrieves all available planets
router.get('/', controller.getAllPlanets);

module.exports = router;