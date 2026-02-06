// =================================
// REQUIRE MODULES
// =================================
const pool = require('../services/db');

// retrieve the information of all users and sorts them by their level in a descending order.
module.exports.getUserRankedByChallengesCompleted = (callback) => {
    const SQLSTATEMENT = `
    SELECT 
        user_id,
        username,
        level,
        exp,
        total_challenges_completed
    FROM user
    ORDER BY total_challenges_completed DESC
    LIMIT 10
    `;

    pool.query(SQLSTATEMENT, callback);
}

// Get top 10 users ranked by experience points (exp)
module.exports.getUserOrderedByExp = (callback) => {
    const SQLSTATEMENT = `
        SELECT 
            user_id,
            username,
            level,
            exp,
            total_challenges_completed
        FROM user
        ORDER BY exp DESC
        LIMIT 10
    `

    pool.query(SQLSTATEMENT, callback);
}

// Get top 10 users ranked by total planted plants
module.exports.getAllUserByTotalPlantedPlants = (callback) => {
    const SQLSTATEMENT = `
    SELECT 
        user.user_id,
        user.username,
        COUNT(userplant.user_plant_id) AS plant_count
    FROM user
    LEFT JOIN userplant ON userplant.user_id = user.user_id
    GROUP BY user.user_id
    ORDER BY plant_count DESC
    limit 10;
    `;

    pool.query(SQLSTATEMENT, callback);
}