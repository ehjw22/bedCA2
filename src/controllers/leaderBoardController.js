// =================================
// REQUIRE MODULES
// =================================
const model = require('../models/leaderBoardModel');

/*
Handles a request to retrieve all users ordered by their level in descending order.
Calls the model to fetch user records ranked by level and returns them as JSON.
Sends a 500 status code if there is an error during the database query. 
*/
module.exports.getAllUserByLevel = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllUserByLevel:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }

    model.getUserRankedByLevel(callback);
}