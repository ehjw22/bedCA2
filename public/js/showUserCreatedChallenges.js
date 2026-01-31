function displayCreatedChallenges(createdChallengesList) {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        createdChallengesList.innerHTML = "";
        responseData.forEach(challenge => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="card h-100 d-flex flex-column p-3">
                <h4 class="card-title">${challenge.description}</h4>
                <hr>
                <div class="mt-auto">
                    <p class="card-text text-center">Points: ${challenge.points} Points</p>
                    <div class="row g-1">
                        <div class="col-6">
                            <button class="p-2 btn w-100 btn-primary deleteChallengeBtn" data-challenge-id="${challenge.challenge_id}">Delete</button>
                        </div>
                        <div class="col-6">
                            <button class="p-2 btn w-100 col-6 btn-primary updateChallengeBtn" data-challenge-id="${challenge.challenge_id}">Update</button>
                        </div>
                    </div>
                </div>    

            </div>
            `;
            createdChallengesList.appendChild(displayItem);
        })
    }

    fetchMethod(currentUrl +`/api/user/token/challenges`, callback, "GET", null, localStorage.getItem("token"));
}

document.addEventListener("DOMContentLoaded", () => {
    const createdChallengesList = document.getElementById('createdChallenges')
    displayCreatedChallenges(createdChallengesList);
})

document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("deleteChallengeBtn")) return;
    const callback = (responseStatus, responseData) => {
        console.log(responseStatus);
        console.log(responseData);
        if (responseStatus == 204) {
            const createdChallengesList = document.getElementById('createdChallenges')
            showCompletedChallenges()
            displayCreatedChallenges(createdChallengesList)
        }

    }
    fetchMethod(currentUrl + `/api/challenges/${event.target.dataset.challengeId}`, callback, "DELETE", null, localStorage.getItem("token"));
})

document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("updateChallengeBtn")) return;

    localStorage.setItem("currentChallengeId", event.target.dataset.challengeId);

    const modal = new bootstrap.Modal(document.getElementById("updateChallengeModal"));
    modal.show();

    
})
const updateChallengeForm = document.getElementById("updateChallengeForm");

updateChallengeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const description = document.getElementById("challengeDescription").value;
    const difficulty = document.getElementById("challengeDifficulty").value;
    const points = document.getElementById("challengePoints").value;

    const data = {
        description,
        difficulty,
        points
    }

    const callback = (responseStatus, responseData) => {
        console.log(responseStatus);
        console.log(responseData);
        if (responseStatus == 200) {
            const createdChallengesList = document.getElementById('createdChallenges');
            bootstrap.Modal.getInstance(document.getElementById("updateChallengeModal")).hide();
            showCompletedChallenges();
            displayCreatedChallenges(createdChallengesList);
        }
    }

    fetchMethod(currentUrl + `/api/challenges/${localStorage.getItem("currentChallengeId")}`, callback, "PUT", data, localStorage.getItem("token"));

})