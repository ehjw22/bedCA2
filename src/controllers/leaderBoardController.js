// =================================
// REQUIRE MODULES
// =================================
const model = require('../models/leaderBoardModel');

/*
Handles a request to retrieve all users ordered by their completed challenges in descending order.
Calls the model to fetch user records ranked by completed challenges and returns them as JSON.
Sends a 500 status code if there is an error during the database query. 
*/
module.exports.getAllUserByChallengesCompleted = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllUserByChallengesCompleted:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }

    model.getUserRankedByChallengesCompleted(callback);
}

/*
Handles a request to retrieve all users ordered by their experience points (exp) in descending order.
Calls the model to fetch user records ranked by exp and returns them as JSON.
Sends a 500 status code if there is an error during the database query.
*/
module.exports.getAllUserByExp = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllUserByExp:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }
    model.getUserOrderedByExp(callback);
}

/*
Handles a request to retrieve all users ordered by their total planted plants in descending order.
Calls the model to fetch user records with plant counts and returns them as JSON.
Sends a 500 status code if there is an error during the database query.
*/
module.exports.getAllUserByPlantedPlants = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllUserByPlantedPlants:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }
    model.getAllUserByTotalPlantedPlants(callback);
}