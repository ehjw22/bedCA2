// =================================
// REQUIRE MODULES
// =================================
const model = require('../models/planetModel');

/*
Handles a request to retrieve all planets from the database.
Calls the planet model to fetch all planet records and returns them as JSON.
Sends a 500 status code if there is an error during the database query.
*/
module.exports.getAllPlanets = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllPlanets:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }

    model.getAllPlanets(callback);
}