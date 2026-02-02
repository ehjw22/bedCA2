// =================================
// REQUIRE MODULES
// =================================
const pool = require('../services/db');

// retrieve the information of all users and sorts them by their level in a descending order.
module.exports.getUserRankedByLevel = (callback) => {
    const SQLSTATEMENT = `
    SELECT 
        user_id,
        username,
        level,
        exp,
        total_challenges_completed
    FROM user
    ORDER BY total_challenges_completed DESC
    `;

    pool.query(SQLSTATEMENT, callback);
}