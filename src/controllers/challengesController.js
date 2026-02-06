// =================================
// REQUIRE MODULES
// =================================
const model = require('../models/challengesModel');

/*
Handles request to verify if a challenge exists by challenge ID.
Calls the model to retrieve the challenge using its ID.
Returns 400 for invalid ID, 404 if not found, or proceeds to next middleware.
*/
module.exports.checkChallengeExist = (req, res, next) => {

    const challengeId = Number(req.params.challenge_id);

    if (isNaN(challengeId) || challengeId <= 0) {
        return res.status(400).json({message: "Invalid format for challenge ID"})
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkChallengeExist:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "No challenge exist"});
            } else {
                res.locals.points = results[0].points;
                next();
            }
        }
    }

    const data = {
        id: challengeId
    }

    model.getChallengeById(data, callback);
}

/*
Handles request to create a new challenge with validation.
Calls the model to insert a new challenge record into the database.
Returns 201 on success, 400 for invalid input, or 500 on error.
*/
module.exports.addChallenges = (req, res, next) => {

    const description = req.body.description;
    const user_id = Number(res.locals.userId);
    const points = Number(req.body.points);

    if (description === undefined || description === "") {
        return res.status(400).json({message: "Please enter a description of the challenge"})
    }

    if (isNaN(user_id) || user_id <= 0) {
        return res.status(400).json({message: "Invalid format for user_id"})
    }

    if (isNaN(points) || points < 0) {
        return res.status(400).json({message: "Invalid format for points"})
    }

    const callback = (error, results, fields) => {
        if (error) {
            if (error.errno === 1265) {
                return res.status(400).json({message: "Difficulty should be either Easy, Medium or hard"})
            }
            console.error("Error addChallenges:", error);
            return res.status(500).json(error);
        } else {
            return res.status(201).json({
                challenge_id: results.insertId,
                description: description,
                creator_id: user_id,
                points: points
            });
        }
    }

    const data = {
        description: description,
        user_id: user_id,
        points: points,
        difficulty: req.body.difficulty
    };

    model.addChallenge(data, callback);
}

/*
Handles request to retrieve all challenges.
Calls the model to fetch all challenge records.
Returns 200 with results or 500 on error.
*/
module.exports.getAllChallenge = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllChallenges:", error);
            return res.status(500).json(error);
        } else {
            return res.status(200).json(results);
        }
    }

    model.readAllChallenges(callback);
}

/*
Handles request to delete a challenge by challenge ID.
Calls the model to remove the challenge from the database.
Returns 404 if not found or proceeds to next middleware on success.
*/
module.exports.deleteChallengeById = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteChallengeById:", error);
            return res.status(500).json(error);
        } else {
            if (results.affectedRows === 0) {
                return res.status(404).json({message: "No challenge found"});
            } else {
                next();
            }
        }
    }

    const data = {challenge_id: req.params.challenge_id};

    model.deleteChallenge(data, callback);
}

/*
Handles request to update an existing challenge.
Calls the model to update challenge details by challenge ID.
Returns 200 on success, 400 for invalid input, or 500 on error.
*/
module.exports.updateChallenge = (req, res, next) => {

    const inputDescription = req.body.description;
    const inputPoints = Number(req.body.points);
    const creatorId = res.locals.userId;
    const difficulty = req.body.difficulty

    if (inputDescription === undefined || inputDescription === "") {
        return res.status(400).json({message: "Invalid format for description of challenge"});
    }

    if (isNaN(inputPoints) || inputPoints <= 0) {
        return res.status(400).json({message: "Invalid format for number of points for challenge"});
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateChallenge:", error);
            return res.status(500).json(error);
        } else {
            return res.status(200).json({
                challenge_id: req.params.challenge_id,
                description: inputDescription,
                creator_id: creatorId,
                points: inputPoints
            })
        }
    }

    const data = {
        creator_id: creatorId, 
        description: inputDescription,
        challenge_id: req.params.challenge_id,
        points: inputPoints,
        difficulty
    };

    model.updateChallenge(data, callback);
}

/*
Handles request to verify the creator of a challenge.
Calls the model to retrieve the creator ID of the challenge.
Returns 403 if not owner, 404 if not found, or proceeds to next middleware.
*/
module.exports.checkCreatorOfChallenge = (req, res, next) => {
    const inputCreator_id = Number(res.locals.userId);

    if (isNaN(inputCreator_id) || inputCreator_id <= 0) {
        return res.status(400).json({message: "Invalid format for user ID"})
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkCreatorOfChallenge:", error);
            return res.status(500).json(error);
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "Challenge could not be found"});
            } else if (results[0].creator_id !== inputCreator_id) {
                return res.status(403).json({message: "You are not the correct owner"});
            } else {
                next();
            }
        }
    }
    const data = {id: req.params.challenge_id};

    model.getChallengeById(data, callback);
}

/*
Handles request to retrieve a challenge by its ID.
Calls the model to fetch challenge details.
Returns 404 if not found or 200 with the challenge data.
*/
module.exports.getChallengeById = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getChallengeById:", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results[0]);
        }
    }

    const data = {id: req.params.challenge_id};

    model.getChallengeById(data, callback);
}

/*
Handles request to retrieve challenges similar to a given text.
Calls the model to perform similarity matching.
Returns a list of similar challenges or 500 on error.
*/
module.exports.getSimilarChallenges = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getSimilarChallenges", error);
            return res.status(500).json({message: "Internal server error"});
        } else {
            return res.status(200).json(results);
        }
    }

    const data = {
        text: req.body.text
    }

    model.retrieveSimilarChallenges(data, callback);
}

/*
Handles request to verify that the user is NOT the creator of a challenge.
Calls the model to retrieve the creator ID of the challenge.
Returns 403 if user is the creator, 404 if not found, or proceeds to next middleware.
*/
module.exports.checkUserIsCreator = (req, res, next) => {
    const inputCreator_id = Number(res.locals.userId);

    if (isNaN(inputCreator_id) || inputCreator_id <= 0) {
        return res.status(400).json({message: "Invalid format for user ID"})
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkCreatorOfChallenge:", error);
            return res.status(500).json(error);
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "Challenge could not be found"});
            } else if (results[0].creator_id == inputCreator_id) {
                return res.status(403).json({message: "You are not the correct owner"});
            } else {
                next();
            }
        }
    }
    const data = {id: req.params.challenge_id};

    model.getChallengeById(data, callback);
}