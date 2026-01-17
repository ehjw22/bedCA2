// =================================
// REQUIRE MODULES
// =================================
const pool = require('../services/db');

// Retrieves all completion records for a specific challenge, including the user_id and details fields.
module.exports.getUserCompletionByChallengeId = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT user_id, details FROM usercompletion
    WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves the points of a challenge from the wellnesschallenge table using its challenge_id meanwhile checking that the challenge also exists.
module.exports.checkChallengeExist = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT points from wellnesschallenge
    WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Inserts a new record into the UserCompletion table with challenge_id, user_id, details, points_earned, difficulty_rating, and feedback.
module.exports.addCompletionRecord = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO UserCompletion (challenge_id, user_id, details, points_earned, difficulty_rating, feedback)
    VALUES (?, ?, ?, ?, ?, ?);
    `;

    const VALUES = [data.challenge_id, data.user_id, data.details, data.points, data.difficultyRating, data.feedback];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Deletes all records from the UserCompletion table that match a specific challenge_id.
module.exports.deleteUserCompletionByChallengeId = (data, callback) => {
    const SQLSTATEMENT = `
    DELETE FROM UserCompletion
    WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}