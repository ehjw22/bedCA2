const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}

bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

    const SQLSTATEMENT = `
        DROP TABLE IF EXISTS WellnessChallenge;

        DROP TABLE IF EXISTS User;

        DROP TABLE IF EXISTS UserCompletion;

        DROP TABLE IF EXISTS Level;

        DROP TABLE IF EXISTS Badge;

        DROP TABLE IF EXISTS UserBadge;

        DROP TABLE IF EXISTS Planet;

        DROP TABLE IF EXISTS UserPlanet;

        DROP TABLE IF EXISTS Plant;

        DROP TABLE IF EXISTS UserPlant;

        DROP TABLE IF EXISTS UserBoughtPlants;

        CREATE TABLE User (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            points INT DEFAULT 0,
            email VARCHAR(255) UNIQUE,
            total_challenges_completed INT DEFAULT 0,
            level INT DEFAULT 1,
            exp INT DEFAULT 0,
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL,
            password VARCHAR(255) NOT NULL
        );

        CREATE TABLE WellnessChallenge (
            challenge_id INT AUTO_INCREMENT PRIMARY KEY,
            creator_id INT NOT NULL,
            description TEXT NOT NULL,
            points INT NOT NULL,
            difficulty ENUM('Easy', 'Medium', 'Hard')
        );

        CREATE TABLE UserCompletion (
            completion_id INT AUTO_INCREMENT PRIMARY KEY,
            challenge_id INT NOT NULL,
            user_id INT NOT NULL,
            details TEXT,
            completed_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            points_earned INT,
            difficulty_rating INT CHECK(difficulty_rating BETWEEN 1 AND 5),
            feedback TEXT
        );

        CREATE TABLE Level (
            level INT PRIMARY KEY,
            exp_required INT NOT NULL,
            title VARCHAR(100)
        );

        CREATE TABLE Badge (
            badge_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            challenges_required INT DEFAULT 0
        );

        CREATE TABLE UserBadge (
            user_id INT NOT NULL,
            badge_id INT NOT NULL,
            earned_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, badge_id)
        );

        CREATE TABLE Planet (
            planet_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            unlock_level INT NOT NULL,
            description TEXT
        );

        CREATE TABLE UserPlanet (
            user_id INT NOT NULL,
            planet_id INT NOT NULL,
            unlocked_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, planet_id)
        );

        CREATE TABLE Plant (
            plant_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            growth_time_days INT,
            plant_cost INT DEFAULT 10,
            unlock_level INT NOT NULL
        );

        CREATE TABLE UserPlant (
            user_plant_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            planet_id INT NOT NULL,
            plant_id INT NOT NULL,
            planted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE UserBoughtPlants (
            user_id INT NOT NULL,
            plant_id INT NOT NULL,
            quantity INT DEFAULT 1,
            PRIMARY KEY (user_id, plant_id)
        );

        INSERT INTO User (username, email, password, total_challenges_completed, level, exp) VALUES
        ('admin', 'admin@example.com', '${hash}', 0, 1, 70);

        INSERT INTO WellnessChallenge (creator_id, description, points, difficulty) VALUES
        (1, "Sleep like a boss - Get 7+ hours of sleep", 10, "Easy"),
        (1, "Stairs over elevator - Take the stairs today", 20, "Medium"),
        (2, "Digital detox - No phone for 1 hour", 10, "Easy"),
        (2, "Touch grass IRL - 15-minute walk outside", 10, "Easy"),
        (3, "Declutter your desk or room", 20, "Medium");

        INSERT INTO UserCompletion 
        (challenge_id, user_id, details, points_earned, difficulty_rating, feedback)
        VALUES
        (1, 1, "Slept 8 hours", 10, 1, "Felt great"),
        (2, 1, "Used stairs at office", 20, 3, "Legs hurt"),
        (3, 1, "No phone for an hour", 10, 4, "Hard but doable"),
        (4, 1, "Walked in park", 10, 2, "Relaxing"),
        (5, 1, "Cleaned room", 20, 2, "Very satisfying");

        INSERT INTO Level (level, exp_required, title) VALUES
        (1, 0, "Space Novice"),
        (2, 100, "Planet Hopper"),
        (3, 300, "Galactic Gardener"),
        (4, 600, "Master of the Cosmos");

        INSERT INTO Badge (name, description, challenges_required) VALUES
        ("Seed Sower", "Completed 1 challenge", 1),
        ("Planet Explorer", "Completed 3 challenges", 3),
        ("Botanical Genius", "Completed 5 challenges", 5);

        INSERT INTO UserBadge (user_id, badge_id) VALUES
        (1, 1), 
        (1, 2), 
        (1, 3);

        INSERT INTO Planet (name, unlock_level, description) VALUES
        ("Aurelia", 1, "Starter planet for new gardeners"),
        ("Crimsonis", 2, "Rocky planet with rare flora"),
        ("Zephyra", 3, "Windy planet for fast growth"),
        ("Lumina", 4, "High-level glowing planet");

        INSERT INTO UserPlanet (user_id, planet_id) VALUES
        (1, 1);

        INSERT INTO Plant (name, growth_time_days, plant_cost, unlock_level) VALUES
        ("Cosmo Cactus", 3, 10, 1),
        ("Lunar Lily", 5, 15, 1),
        ("Solar Sunflower", 4, 12, 1),
        ("Starfruit Tree", 6, 20, 2),
        ("Nebula Orchid", 7, 25, 3);

        INSERT INTO UserBoughtPlants (user_id, plant_id, quantity) VALUES
        (1, 1, 1),
        (1, 2, 1);

        INSERT INTO UserPlant (user_id, planet_id, plant_id) VALUES
        (1, 1, 1);
      `;

    pool.query(SQLSTATEMENT, callback);
  }
});
