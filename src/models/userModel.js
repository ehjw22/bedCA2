// =================================
// REQUIRE MODULES
// =================================
const pool = require('../services/db');

// Inserts a new record into the User table with username, email, and password.
module.exports.createUser = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO User (username, email, password, tiktok) 
    VALUES (?, ?, ?, ?);
    `;

    const VALUES = [data.username, data.email, data.password, data.tiktok];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all users from the User table, including user_id, username, and points.
module.exports.readAllUser = (callback) => {
    const SQLSTATEMENT = `
    SELECT 
        user_id,
        username,
        points
    FROM user;
    `;

    pool.query(SQLSTATEMENT, callback);
}

// Retrieves all fields of a user from the User table that matches a specific user_id.
module.exports.readUserById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT
        *
    FROM user
    WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Updates username, points, email, and password for a user identified by user_id.
module.exports.updateUser = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE user 
    SET username = ?, email = COALESCE(?, email), password = COALESCE(?, password)
    WHERE user_id = ?; 
    `;

    const VALUES = [data.username, data.email, data.newPassword, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all user records where username matches the provided value.
module.exports.checkUsernameExist = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM
    user
    WHERE username = ?;
    `;

    const VALUES = [data.username];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Updates a user’s points, increments total_challenges_completed, and updates exp for a specific user_id.
module.exports.updateDetails = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE user 
    SET points = points + ?, total_challenges_completed = total_challenges_completed + 1, exp = points
    WHERE user_id = ?;

    SELECT * FROM user
    WHERE user_id = ?;
    `;

    const VALUES = [data.addPoints, data.user_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all fields of a user where username or email matches the provided values.
module.exports.getUserId = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM user
    WHERE username = ? OR email = ?;
    `;

    const VALUES = [data.identifier || data.username, data.identifier || data.email];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Updates the last_login timestamp of a user identified by user_id to the current time.
module.exports.updateLogin = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE user
    SET last_login = NOW()
    WHERE user_id = ?;
    `;

    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all badges earned by a user, including badge name, description, and earned_on date, using an INNER JOIN with the badge table.
module.exports.getBadges = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT
        badge.name,
        badge.description,
        userbadge.earned_on
    FROM userbadge
    INNER JOIN badge ON badge.badge_id = userbadge.badge_id
    WHERE user_id = ?;
    `;

    const VALUES = [data.id];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all planets owned by a user, including planet_id, name, and description, using an INNER JOIN with the planet table.
module.exports.getPlanets = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT
        planet.planet_id as planetNumber,
        planet.name,
        planet.description,
        planet.planetImage as planetImage
    FROM userplanet
    INNER JOIN planet ON planet.planet_id = userplanet.planet_id
    WHERE userplanet.user_id = ?;
    `;

    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all plants owned by a user, including plant_id, name, planted_on, and growth_stage, using an INNER JOIN with the userplant table.
module.exports.getPlants = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT 
        planet.name as planetName,
        plant.plantImage as plantImage,
        plant.name as plantName,
        userplant.*,
        LEAST(
            FLOOR(TIMESTAMPDIFF(DAY, userplant.planted_on, NOW())),
            plant.growth_time_days
        ) AS growth_stage,
        plant.growth_time_days as growthTime
    FROM UserPlant
    JOIN Plant ON userplant.plant_id = plant.plant_id
    JOIN planet on userplant.planet_id = planet.planet_id
    WHERE userplant.user_id = ? AND planet.planet_id = ?;
    `;

    const VALUES = [data.id, data.planet_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Updates a user’s level based on the maximum level whose exp_required is less than or equal to the user’s exp, and retrieves the updated level.
module.exports.updateUserLevel = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE user
    SET level = (
        SELECT MAX(level)
        FROM Level
        WHERE exp_required <= user.exp
    )
    WHERE user_id = ?;

    SELECT level FROM user WHERE user_id = ?;
    `;

    const VALUES = [data.user_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all completion records for a specific user, including challenge_id, details, completed_on, points_earned, and difficulty_rating.
module.exports.getUsersCompletedChallenges = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT
        wellnesschallenge.description as challenge,
        wellnesschallenge.difficulty,
        usercompletion.challenge_id,
        usercompletion.details,
        usercompletion.completed_on,
        usercompletion.points_earned,
        usercompletion.difficulty_rating,
        usercompletion.feedback
    FROM usercompletion
    INNER JOIN user ON usercompletion.user_id = user.user_id
    INNER JOIN wellnesschallenge ON wellnesschallenge.challenge_id = usercompletion.challenge_id
    WHERE user.user_id = ?;
    `;

    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all records from userplanet table for a specific user_id.
module.exports.getPlanetsOfUser = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM userplanet
    WHERE user_id = ?;
    `;

    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all plants owned by a user and calculates their current growth_stage based on time since planting.
module.exports.getPlantsOfUser = (data, callback) => {
    const SQLSTATEMENT = `
    select 
        plant.plant_id,
        plant.name,
        userplant.growth_stage,
        userplant.planted_on
    from userplant
    inner join plant on userplant.plant_id = plant.plant_id
    where user_id = ?;
    `;

    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all fields from the plant table where plant_id matches the provided value.
module.exports.checkPlantExist = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM plant
    WHERE plant_id = ?;
    `;

    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves all fields from the planet table where planet_id matches the provided value.
module.exports.checkPlanetExist = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM planet
    WHERE planet_id = ?;
    `;

    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves records from userplanet where user_id and planet_id match the provided values.
module.exports.checkUserOwnPlanet = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM userplanet
    WHERE planet_id = ? AND user_id = ?;
    `;

    const VALUES = [data.planet_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Inserts a record into UserPlant for a user planting a plant on a planet and decrements the quantity in UserBoughtPlants within a transaction.
module.exports.plantPlant = (data, callback) => {
    const SQLSTATEMENT = `
    START TRANSACTION;

    INSERT INTO UserPlant (user_id, planet_id, plant_id)
    VALUES (?, ?, ?);

    Update UserBoughtPlants
    SET quantity = quantity - 1
    WHERE user_id = ? AND plant_id = ? AND quantity > 0;

    COMMIT;
    `;

    const VALUES = [
        data.user_id,
        data.planet_id,
        data.plant_id,
        data.user_id,
        data.plant_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Retrieves records from userplant where user_id and plant_id match the provided values.
module.exports.checkUserOwnsPlant = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM userplant
    WHERE plant_id = ? AND user_id = ?;
    `;

    const VALUES = [data.plant_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Deletes a record from userplant where user_id and plant_id match the provided values.
module.exports.deletePlantOwnedByUser = (data, callback) => {
    const SQLSTATEMENT = `
    DELETE FROM userplant
    WHERE user_plant_id = ?;
    `;

    const VALUES = [data.user_plant_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Inserts records into userplanet for planets whose unlock_level is less than or equal to the user’s level, excluding planets the user already owns.
module.exports.unlockPlanets = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO userplanet (user_id, planet_id)
    SELECT ?, planet_id
    FROM planet
    WHERE unlock_level <= ?
    AND planet_id NOT IN (
        SELECT planet_id from userplanet WHERE user_id = ?
    );
    `;

    const VALUES = [data.user_id, data.user_level, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves a user’s level and points and a plant’s unlock_level and plant_cost using an INNER JOIN.
module.exports.getUserNPlantInfo = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT 
        user.level as user_level,
        user.points as user_points,
        plant.unlock_level,
        plant.plant_cost
    FROM user
    INNER JOIN plant ON plant.plant_id = ?
    WHERE user.user_id = ?;
    `;

    const VALUES = [data.plant_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Updates a user’s points and inserts or updates a record in UserBoughtPlants within a transaction.
module.exports.purchasePlant = (data, callback) => {
    const SQLSTATEMENT = `
    START TRANSACTION;

    UPDATE User
    SET points = points - ?
    WHERE user_id = ? AND points >= ?;

    INSERT INTO UserBoughtPlants (user_id, plant_id, quantity)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE
    quantity = quantity + 1;

    COMMIT;
    `;

    const VALUES = [data.plant_cost, data.user_id, data.plant_cost, data.user_id, data.plant_id];
    console.error(VALUES)
    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Retrieves records from UserBoughtPlants for a specific user_id and plant_id.
module.exports.getUserOwnedPlants = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM UserBoughtPlants
    WHERE user_id = ? AND plant_id = ?;
    `;

    const VALUES = [data.user_id, data.plant_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.getUserPlantedPlants = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM userboughtplants
    WHERE user_id = ? AND plant_id = ?;
    `;

    const VALUES = [data.user_id, data.plant_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Checks whether the user has unlocked a badge and insert it into the userbadge table
module.exports.checkNUnlockBadges = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO UserBadge (user_id, badge_id)
    SELECT ?, badge_id
    FROM badge
    WHERE challenges_required <= ?
    AND NOT EXISTS (
        SELECT * FROM UserBadge
        WHERE user_id = ? and badge_id = badge.badge_id
    );
    `;

    const VALUES = [data.user_id, data.challenges_required, data.user_id,];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.registerUser = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO User (username, email, password) VALUES
    (?, ?, ?);
    `;

    const VALUES = [data.username, data.email, data.password];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.getUserBoughtPlants = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT 
        userboughtplants.user_id,
        plant.name,
        plant.plant_id,
        userboughtplants.quantity,
        plant.growth_time_days
    FROM userboughtplants
    INNER JOIN plant on plant.plant_id = userboughtplants.plant_id
    WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.getUsersCreatedChallenges = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM wellnesschallenge
    WHERE creator_id = ?;
    `;

    const VALUES = [data.userId];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.unlockUserPlanets = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO userplanet (user_id, planet_id)
    VALUES (?, 1);
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}