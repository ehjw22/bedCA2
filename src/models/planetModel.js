// =================================
// REQUIRE MODULES
// =================================
const pool = require('../services/db');

// retrieves planet_id, name and description of planets from the planet table
module.exports.getAllPlanets = (callback) => {
    const SQLSTATEMENT = `
    SELECT 
        planet_id,
        name, 
        description
    FROM planet
    `;

    pool.query(SQLSTATEMENT, callback);
}