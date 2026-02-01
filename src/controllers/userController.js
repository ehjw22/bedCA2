// =================================
// REQUIRE MODULES
// =================================
const model = require('../models/userModel');

/*
Handles request to create a new user with input validation.
Calls the model to insert a new user into the database.
Returns 201 on success, 400 for invalid input, or 500 on error.
*/
module.exports.addUser = (req, res, next) => {

    const inputPassword = req.body.password;
    const inputEmail = req.body.email;

    if (inputPassword === undefined || inputPassword.length < 8) {
        return res.status(400).json({message: "Please enter a valid password with at least 8 characters"});
    }

    if (inputEmail === undefined) {
        return res.status(400).json({message: "Please enter a valid email"})
    }

    const callback = (error, results, fields) => {
        if (error) {
            if (error.errno === 1062) {
                return res.status(400).json({message: "Email is already linked to another account"});
            }

            console.error("Error addUser:", error);
            return res.status(500).json(error);
        } else {
            return res.status(201).json({
                user_id: results.insertId,
                username: req.body.username,
                points: 0
            })
        }
    }

    const data = {
        username: req.body.username,
        email: inputEmail,
        password: inputPassword
    };
    
    model.createUser(data, callback);
}

/*
Handles request to retrieve all users.
Calls the model to fetch all user records.
Returns 200 with results or 500 on error.
*/
module.exports.getAllUsers = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllUsers:", error);
            return res.status(500).json(error);
        } else {
            return res.status(200).json(results);
        }
    }

    model.readAllUser(callback);
}

/*
Handles request to retrieve a user by user ID.
Calls the model to fetch user details by ID.
Returns 200 on success, 404 if not found, or 500 on error.
*/
module.exports.getUserById = (req, res, next) => {

    const userId = Number(req.params.user_id || res.locals.userId);

    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({message: "Invalid format for user_id"});
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserById:", error);
            return res.status(500).json(error);
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "No user found"});
            } else {
                return res.status(200).json(results[0]);
            }
        }
    }

    const data = {user_id: req.params.user_id || res.locals.userId};

    model.readUserById(data, callback);
}

/*
Handles request to verify a user’s password.
Calls the model to retrieve the stored password.
Returns 403 if incorrect or proceeds to next middleware.
*/
module.exports.checkPassword = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkPassword:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (req.body.password === results[0].password) {
                return next();
            } else {
                return res.status(403).json({message: "Incorrect Password"});
            }
        }
    }

    const data = {
        user_id: req.params.user_id
    }
    
    model.readUserById(data, callback);
}

/*
Handles request to verify if a user ID exists.
Calls the model to check user existence by ID.
Returns 400 for invalid ID, 404 if not found, or proceeds to next middleware.
*/
module.exports.checkUserIdExist = (req, res, next) => {
    const inputId = Number(req.params.user_id);

    if (isNaN(inputId) || inputId <= 0) {
        return res.status(400).json({message: "Invalid format for user id"})
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserIdExist", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "User not found"});
            } else {
                next();
            }
        }
    }

    const data = {
        user_id: inputId
    }

    model.readUserById(data, callback);
}

/*
Handles request to update user details with validation.
Calls the model to update user information in the database.
Returns 400 for invalid input, 404 if not found, or proceeds to next middleware.
*/
module.exports.updateUser = (req, res, next) => {

    const points = Number(req.body.points);

    const inputEmail = req.body.email;

    if (isNaN(points) || points < 0) {
        return res.status(400).json({message: "Invalid format for points"});
    }

    const callback = (error, results, fields) => {
        if (error) {
            if (error.errno === 1062) {
                return res.status(400).json({message: "Email is already linked to another accont"});
            }
            console.error("Error updateUser:", error);
            return res.status(500).json(error);
        } else {
            if (results.affectedRows === 0) {
                return res.status(404).json({message: "User not found"});
            } else {
                next();
            }
        }
    }

    const data = {user_id: req.params.user_id, username: req.body.username, points: points, email: inputEmail ?? null, newPassword: req.body.newPassword ?? null};

    model.updateUser(data, callback)
}

/*Handles request to send updated user information.
Returns 200 with updated user details.
*/
module.exports.sendResponse = (req, res, next) => {
    return res.status(200).json({
        user_id: req.params.user_id,
        username: req.body.username,
        points: req.body.points
    });
}

/* 
Handles request to check if a username already exists.
Calls the model to verify username availability.
Returns 409 if username exists or proceeds to next middleware.
*/
module.exports.checkNameExist = (req, res, next) => {

    if (req.body.username === undefined || req.body.username === "") {
        return res.status(400).json({message: "Invalid format for username"});
    }

    const data = {
        username: req.body.username
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkNameExist:", error);
            res.status(500).json(error);
        } else {
            if (results.length !== 0) {
                if (results[0].user_id == req.params.user_id) {
                    return next();
                }
                return res.status(409).json({message: "Username already exists"});
            } else {
                next();
            }
        }
    }
    
    model.checkUsernameExist(data, callback);
}

/* 
Handles request to verify user existence from request body.
Calls the model to retrieve user by ID.
Returns 400 for invalid ID, 404 if not found, or proceeds to next middleware.
*/
module.exports.checkUserExist = (req, res, next) => {
    const inputUserId = Number(req.body.user_id);

    if (isNaN(inputUserId) || inputUserId <= 0) {
        return res.status(400).json({message: "Invalid format for user id"});
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserExist:", error);
            return res.status(500).json(error);
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "User could not be found"});
            } else {
                next();
            }
        }
    }

    const data = {user_id: inputUserId};

    model.readUserById(data, callback);
}

/* 
Handles request to update user points and experience.
Calls the model to update user statistics.
Returns 500 on error or proceeds to next middleware.
*/
module.exports.updatePointsNExp = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updatePointsNExp:", error);
            return res.status(500).json(error);
        } else {
            res.locals.challenges_required = results[1][0].total_challenges_completed
            return next();
        }
    }

    const data = {
        addPoints: res.locals.points,
        user_id: res.locals.userId
    };

    model.updateDetails(data, callback);
}

/* 
Handles request to update user level based on experience.
Calls the model to calculate and update user level.
Returns 500 on error or proceeds to next middleware.
*/
module.exports.updateLevel = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateLevel:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            res.locals.level = results[1][0].level
            next();
        }
    }

    const data = {
        user_id: res.locals.userId
    }

    model.updateUserLevel(data, callback);
}

/* 
Handles request to retrieve user ID by username or email.
Calls the model to find the matching user record.
Returns 404 if not found or proceeds to next middleware.
*/
module.exports.getUserId = (req, res, next) => {
    
    const inputUsername = req.body.username;
    const inputEmail = req.body.email;

    if (inputEmail != undefined && inputEmail.length === 0) {
        return res.status(400).json({message: "Invalid Email"})
    }

    if (inputUsername != undefined && inputUsername.length === 0) {
        return res.status(400).json({message: "Invalid username"})
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserId:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {    
            if (results.length === 0) {
                return res.status(404).json({message: "The account does not exist, enter a different one or create a new one"});
            } else {
                req.params.user_id = results[0].user_id;
                next();
            }
        }
    }

    const data = {
        email: inputEmail,
        username: inputUsername
    }

    model.getUserId(data, callback);
}

/* 
Handles request to confirm user login.
Calls the model to update last login timestamp.
Returns 200 on successful login or 500 on error.
*/
module.exports.confirmLogin = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error confirmLogin:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            next();
        }
    }

    const data = {
        id: res.locals.userId
    }
    
    model.updateLogin(data, callback);
}

/* 
Handles request to retrieve all badges for a user.
Calls the model to fetch user badges.
Returns 200 with results, 404 if none, or 500 on error.
*/
module.exports.getAllBadges = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllBadges:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "Complete more challenges to get badges"});
            }
            return res.status(200).json(results);
        }
    }

    const data = {
        id: res.locals.userId
    }

    model.getBadges(data, callback);
}

/* 
Handles request to retrieve all planets accessible to a user.
Calls the model to fetch planet data.
Returns 200 with results or 500 on error.
*/
module.exports.getAllPlanets = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllBadges:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }

    const data = {
        id: res.locals.userId
    }

    model.getPlanets(data, callback);
}

/* 
Handles request to retrieve all plants accessible to a user.
Calls the model to fetch plant data.
Returns 200 with results or 500 on error.
*/
module.exports.getAllPlants = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllPlants:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }

    const data = {
        id: res.locals.userId
    }

    model.getPlants(data, callback);
}

/* 
Handles request to retrieve completed challenges of a user.
Calls the model to fetch completed challenge records.
Returns 200 with results, 404 if none, or 500 on error.
*/
module.exports.getCompletedChallenges = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getCompletedChallenges:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.length === 0 ) {
                return res.status(404).json({message: "No completed challenges."});
            } else {
                return res.status(200).json(results);
            }
        }
    }

    const data = {
        id: res.locals.userId
    }

    model.getUsersCompletedChallenges(data, callback);
}

/* 
Handles request to retrieve planets owned by a user.
Calls the model to fetch user-owned planets.
Returns 200 with results or 500 on error.
*/
module.exports.getUserPlanets = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserPlanets:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }

    const data = {
        id: req.params.user_id
    }

    model.getPlanetsOfUser(data, callback);
}

/* 
Handles request to retrieve plants owned by a user.
Calls the model to fetch user-owned plants.
Returns 200 with results or 500 on error.
*/
module.exports.getUserPlants = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserPlants:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }

    const data = {
        id: req.params.user_id
    }

    model.getPlantsOfUser(data, callback);
}

/* 
Handles request to verify if a plant ID exists.
Calls the model to check plant existence.
Returns 400 for invalid ID, 404 if not found, or proceeds to next middleware.
*/
module.exports.checkPlantIdExist = (req, res, next) => {

    const inputPlantId = Number(req.params.plant_id);

    if (isNaN(inputPlantId) || inputPlantId <= 0) {
        return res.status(400).json({message: "Invalid format for plant ID"});
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkPlantIdExist:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "Plant does not exist"});
            } else {
                next();
            }
        }
    }

    const data = {
        id: inputPlantId
    }

    model.checkPlantExist(data, callback);
}

/* 
Handles request to verify if a planet ID exists.
Calls the model to check planet existence.
Returns 400 for invalid ID, 404 if not found, or proceeds to next middleware.
*/
module.exports.checkPlanetIdExist = (req, res, next) => {
    const inputPlanetId = Number(req.body.planet_id);

    if (isNaN(inputPlanetId) || inputPlanetId <= 0) {
        return res.status(400).json({message: "Invalid format for planet id"});
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkPlanetIdExist:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "Planet does not exist"});
            } else {
                next();
            }
        }
    }

    const data = {
        id: inputPlanetId
    }

    model.checkPlanetExist(data, callback);
}

/* 
Handles request to verify user ownership of a planet.
Calls the model to check planet ownership.
Returns 404 if not owned or proceeds to next middleware.
*/
module.exports.checkUserOwnsPlanet = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserOwnsPlanet:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "User does not own this plant, you must purchase it first"});
            } else {
                next();
            }
        }
    }

    const data = {
        user_id: req.params.user_id,
        planet_id: req.body.planet_id
    }

    model.checkUserOwnPlanet(data, callback);
}

/* 
Handles request to plant a plant on a planet.
Calls the model to create a user-plant record.
Returns 201 on success or 500 on error.
*/
module.exports.plantPlant = (req, res, next) => {
    const callback = (error, results) => {
        if (error) {
            console.error("Error plantPlant:", error);
            return res.status(500).json({ message: "Internal server error" });
        } else {
            res.status(201).json({
                message: "Plant planted successfully",
                user_plant_id: results.insertId
            });
        }
    };

    const data = {
        user_id: req.params.user_id,
        plant_id: req.params.plant_id,
        planet_id: req.body.planet_id
    };

    model.plantPlant(data, callback);
}

/* 
Handles request to delete a user-owned plant.
Calls the model to remove the plant record.
Returns 204 on success, 403 if not owned, or 500 on error.
*/
module.exports.deleteUserOwnedPlant = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteUserOwnedPlanet:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.affectedRows === 0) {
                return res.status(403).json({message: "User does not own plant"});
            } else {
                return res.status(204).send();
            }
        }
    }

    const data = {
        user_id: res.locals.userId,
        plant_id: req.params.plant_id
    }

    model.deletePlantOwnedByUser(data, callback);

}

/* 
Handles request to unlock planets based on user level.
Calls the model to unlock eligible planets.
Returns 500 on error or proceeds to next middleware.
*/
module.exports.unlockPlanets = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error unlockPlanets:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            next();
        }
    }

    const data = {
        user_id: res.locals.userId,
        user_level: res.locals.level
    }

    model.unlockPlanets(data, callback);
}

/* 
Handles request to verify if user can purchase a plant.
Calls the model to retrieve user and plant details.
Returns 403 if requirements not met or proceeds to next middleware.
*/
module.exports.checkUserCanBuyPlant = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserCanBuyPlant:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results[0].user_level < results[0].unlock_level) {
                return res.status(403).json({message: "User level is too low to buy this plant"})
            }

            if (results[0].user_points < results[0].plant_cost) {
                return res.status(403).json({message: "Insufficient points to buy this plant"});
            }

            res.locals.UserNPlantInfo = results[0]
            next();
        }
    }

    const data = {
        plant_id: req.params.plant_id,
        user_id: req.params.user_id
    }

    model.getUserNPlantInfo(data, callback);
}  

/* 
Handles request to purchase a plant.
Calls the model to complete the purchase transaction.
Returns 201 on success or 500 on error.
*/
module.exports.buyPlant = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserCanBuyPlant:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(201).json({message: "Plant purchased successfully"});
        }
    }

    const data = {
        plant_id: req.params.plant_id,
        user_id: req.params.user_id,
        plant_cost: res.locals.UserNPlantInfo.plant_cost
    }

    model.purchasePlant(data, callback);
}

/* 
Handles request to verify user ownership of a plant.
Calls the model to check plant ownership.
Returns 403 if not owned or proceeds to next middleware.
*/
module.exports.checkUserOwnsPlant = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserOwnsPlant:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.length == 0) {
                return res.status(403).json({message: "You do not own this plant", user_id: res.locals.userId});
            }
            next();
        }
    }
    const data = {
        plant_id: req.params.plant_id,
        user_id: res.locals.userId
    }

    model.getUserPlantedPlants(data, callback);
}

/* 
Unlocks any new badges a user qualifies for after completing challenges.
This middleware checks the user's total challenges completed and inserts
any eligible badges that the user does not already own, then proceeds
to the next middleware in the request chain.
*/
module.exports.unlockBadges = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error unlockBadges:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            next();
        }
    }

    const data = {
        user_id: res.locals.userId,
        challenges_required: res.locals.challenges_required
    };

    model.checkNUnlockBadges(data, callback);
}

module.exports.login = (req, res, next) => {

    // const inputUsername = req.body.username;
    // const inputEmail = req.body.email;

    // if (inputEmail != undefined && inputEmail.length === 0) {
    //     return res.status(400).json({message: "Invalid Email"})
    // }

    // if (inputUsername != undefined && inputUsername.length === 0) {
    //     return res.status(400).json({message: "Invalid username"})
    // }

    const inputIdentifier = req.body.identifier;

    if (!inputIdentifier) {
        return res.status(400).json({message: "Invalid identifier"})
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error login:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "User not found"});
            } else {
                res.locals.hash = results[0].password;
                res.locals.userId = results[0].user_id;
                next();
            }
        }
    }

    const data = {
        identifier: req.body.identifier
        // username: inputUsername,
        // email: inputEmail
    }

    model.getUserId(data, callback);
}

module.exports.checkUsernameOrEmailExist = (req, res, next) => {
    const inputUsername = req.body.username;
    const inputEmail = req.body.email;

    if (!inputUsername) {
        return res.status(404).json({message: "Invalid format for username"});
    }

    if (!inputEmail) {
        return res.status(404).json({message: "Invalid format for email"});
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUsernameOrEmailExist:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.length !== 0) {
                return res.status(409).json({message: "Username or email already exists"});
            } else {
                next();
            }
        }
    }

    const data = {
        username: inputUsername,
        email: inputEmail
    };

    model.getUserId(data, callback);
}

module.exports.register = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error register:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            res.locals.userId = results.insertId
            res.locals.message = `User ${req.body.username} created successfully.`
            next();
        }
    }

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: res.locals.hash
    };

    model.registerUser(data, callback);
}

module.exports.getUserBoughtPlants = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserBoughtPlants:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }

    const data = {
        user_id: res.locals.userId
    }
    model.getUserBoughtPlants(data, callback);
}

module.exports.getUserCreatedChallenges = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserCreatedChallenges:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }

    const data = {
        userId: res.locals.userId
    }

    model.getUsersCreatedChallenges(data, callback);
}

module.exports.unlockPlanetsFirstTime = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            return res.status(500).json(error);
        } else {
            next();
        }
    }

    const data = {
        user_id: res.locals.userId
    }

    model.unlockUserPlanets(data, callback);
}