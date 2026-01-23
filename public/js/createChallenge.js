document.addEventListener("click", function (event) {
    if (event.target.id !== "createChallengeBtn") return;

    const token = localStorage.getItem("token");

    if (!token) {
        showToast("Please login/register to create challenges", "error");
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById("createChallengeModal"));
    modal.show();
})

const newChallengeForm = document.getElementById("createChallengeForm");

newChallengeForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const description = document.getElementById("challengeDescription").value;
    const points = document.getElementById("challengePoints").value;
    const difficulty = document.getElementById("challengeDifficulty").value;
    const user_id = localStorage.getItem("userId");

    const data = {
        description,
        points,
        difficulty,
        user_id
    };

    const callback = (responseStatus, responseData) => {
        if (responseStatus == 201) {
            showToast("Challenge successfully created")
            bootstrap.Modal.getInstance(document.getElementById("createChallengeModal")).hide()
            displayChallenges(document.getElementById("challengesList"));
        } else {
            showToast(responseData.message, "error");
        }
    }

    fetchMethod(currentUrl + `/api/challenges`, callback, "POST", data)
})