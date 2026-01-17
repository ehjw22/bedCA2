// =================================
// REQUIRE MODULES
// =================================
const pool = require('../services/db');

// retrieve the information of all users and sorts them by their level in a descending order.
module.exports.getUserRankedByLevel = (callback) => {
    const SQLSTATEMENT = `
    SELECT 
        username,
        level,
        exp
    FROM user
    ORDER BY level DESC
    `;

    pool.query(SQLSTATEMENT, callback);
}