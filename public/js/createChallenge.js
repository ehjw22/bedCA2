document.addEventListener("click", function (event) {
    if (event.target.id !== "createChallengeBtn") return;

    const token = localStorage.getItem("token");

    if (!token) {
        showToast(`Please <a href="login.html" class="link-light">login</a>/<a href="register.html" class="link-light">register</a> to create challenges`, "error");
        return;
    }
    
    const callback = (responseStatus, responseData) => {
        if (responseStatus == 200) {
            const modal = new bootstrap.Modal(document.getElementById("createChallengeModal"));
            modal.show();
        } else if (responseStatus == 401) {
            handleSessionExpired();
        }
    }

    fetchMethod(currentUrl + `/api/jwt/verify`, callback, "GET", null, token);
})

const newChallengeForm = document.getElementById("createChallengeForm");

newChallengeForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const description = document.getElementById("challengeDescription").value;
    const points = document.getElementById("challengePoints").value;
    const difficulty = document.getElementById("challengeDifficulty").value;

    const data = {
        description,
        points,
        difficulty
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

    fetchMethod(currentUrl + `/api/challenges`, callback, "POST", data, localStorage.getItem("token"));
})