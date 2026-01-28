// =================================
// REQUIRE MODULES
// =================================
const model = require('../models/completionsModel');

/*
Handles request to get all completions for a specific challenge.
Calls the model to retrieve completion records by challenge_id.
Returns 200 with results, 404 if no completions, or 500 on error.
*/
module.exports.getUserCompletionByChallengeId = (req, res, next) => {
    const inputChallengeId = Number(req.params.challenge_id);

    if (isNaN(inputChallengeId) || inputChallengeId <= 0) {
        return res.status(400).json({message: "Invalid format for challenge ID"});
    }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserCompletionByChallengeId:", error);
            return res.status(500).json(error);
        } else {
            if (results.length === 0) {
                return res.status(404).json({message: "This challenge has no user attempts"});
            } else {
                return res.status(200).json(results);
            }
        }
    }

    const data = {challenge_id: inputChallengeId};

    model.getUserCompletionByChallengeId(data, callback);
}

/*
Handles request to create a new completion record for a user.
Calls the model to insert a new record into UserCompletion.
Sets res.locals.completionId and calls next middleware, or returns 500 on error.
*/
module.exports.createCompletionRecord = (req, res, next) => {
    const inputDifficulty = Number(req.body.difficulty);

    if (isNaN(inputDifficulty) || inputDifficulty > 5 || inputDifficulty < 1) {
        return res.status(400).json({message: "Difficulty Rating should be between 1 and 5"});
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createCompletionRecord:", error);
            return res.status(500).json(error);
        } else {
            res.locals.completionId = results.insertId
            next();
        }
    }

    const data = {
        user_id: res.locals.userId,
        details: req.body.details,
        challenge_id: req.params.challenge_id,
        feedback: req.body.feedback || "",
        difficultyRating: inputDifficulty,
        points: res.locals.points
    };

    model.addCompletionRecord(data, callback);
}

/*
Handles request to delete all completions for a specific challenge.
Calls the model to delete completion records by challenge_id.
Returns 204 on success or 500 on error.
*/
module.exports.deleteUserCompletion = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteUserCompletion:", error);
            return res.status(500).json(error);
        } else {
            return res.status(204).send();
        }
    }

    const data = {
        challenge_id: Number(req.params.challenge_id)
    }

    model.deleteUserCompletionByChallengeId(data, callback);
}

// Handles sending the response after creating a completion record.
// Returns 200 with completion details in JSON
module.exports.sendResponse = (req, res, next) => {
    return res.status(200).json({
        complete_id: res.locals.completionId,
        challenge_id: Number(req.params.challenge_id),
        user_id: res.locals.user_id,
        details: req.body.details
    });
}