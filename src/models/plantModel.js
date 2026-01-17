// =================================
// REQUIRE MODULES
// =================================
const pool = require('../services/db');

// retrieve the plants plant_id, name, growth_time_days and time_cost from the plant table
module.exports.getAllPlants = (callback) => {
    const SQLSTATEMENT = `
    SELECT 
        plant_id,
        name,
        growth_time_days,
        plant_cost 
    FROM plant;
    `;

    pool.query(SQLSTATEMENT, callback);
}