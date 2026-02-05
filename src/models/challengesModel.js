// =================================
// REQUIRE MODULES
// =================================
const pool = require('../services/db');

// Inserts a new record into the wellnesschallenge table with creator_id, description, points, and difficulty.
module.exports.addChallenge = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO wellnesschallenge (creator_id, description, points, difficulty)
    VALUES (?, ?, ?, ?)
    `;

    const VALUES = [data.user_id, data.description, data.points, data.difficulty];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all records from the wellnesschallenge table, including challenge_id, description, creator_id, and points.
module.exports.readAllChallenges = (callback) => {
    const SQLSTATEMENT = `
    SELECT 
        challenge_id,
        description,
        creator_id,
        points,
        difficulty
    FROM wellnesschallenge;
    `;

    pool.query(SQLSTATEMENT, callback);
}

// Deletes a record from the wellnesschallenge table that matches a specific challenge_id.
module.exports.deleteChallenge = (data, callback) => {
    const SQLSTATEMENT = `
    DELETE FROM wellnesschallenge
    WHERE challenge_id =?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Updates the creator_id, description, and points of a record in the wellnesschallenge table identified by challenge_id.
module.exports.updateChallenge = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE wellnesschallenge
    SET creator_id = ?, description = ?, points = ?, difficulty = ?
    WHERE challenge_id = ?;
    `;

    const VALUES = [data.creator_id, data.description, data.points, data.difficulty, data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all fields of a challenge from the wellnesschallenge table that matches a specific challenge_id.
module.exports.getChallengeById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM wellnesschallenge
    WHERE challenge_id = ?;
    `;

    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.retrieveSimilarChallenges = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM wellnesschallenge
    WHERE description LIKE ?
    LIMIT 5;
    `;

    const VALUES = [`%${data.text}%`];

    pool.query(SQLSTATEMENT, VALUES, callback);
}