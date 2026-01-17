// =================================
// REQUIRE MODULES
// =================================
const model = require('../models/plantModel');

/*
Handles a request to retrieve all plants from the database.
Calls the plant model to fetch all plant records and returns them as JSON.
Sends a 500 status code if there is an error during the database query.
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

    model.getAllPlants(callback);
}