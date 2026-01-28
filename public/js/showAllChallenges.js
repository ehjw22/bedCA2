document.addEventListener("DOMContentLoaded", function() {
    const challengesList = document.getElementById("challengesList");
    const completeForm = document.getElementById("completeForm");
    
    displayChallenges(challengesList)
    
    challengesList.addEventListener("click", function(event) {
        if (!event.target.classList.contains("completeChallengebtn")) return;
       
        const token = localStorage.getItem('token');

        if (!token) {
            showToast("Please login/register to complete challenges", "error");
            return;
        }

        localStorage.setItem("currentChallengeId", event.target.dataset.challengeId);

        const modal = new bootstrap.Modal(document.getElementById("completeModal"));
        modal.show();
    })

    completeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const reflection = document.getElementById("reflection").value;
        const difficulty = document.getElementById("difficulty").value;
        const feedback = document.getElementById("feedback").value;

        const challengeId = localStorage.getItem("currentChallengeId");

        const data = {
            challenge_id: challengeId,
            details: reflection,
            difficulty,
            feedback
        };

        const submitCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                showToast("Challenge successfully completed");
                bootstrap.Modal.getInstance(document.getElementById("completeModal")).hide();
                displayUserStats();
            }
            console.log(responseStatus)
            console.log(responseData);
        }

        fetchMethod(
            currentUrl + `/api/challenges/${challengeId}`,
            submitCallback,
            "POST",
            data,
            localStorage.getItem("token")
        );        
       
        completeForm.reset()
    })
    
    
})

function displayChallenges(challengesList) {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        challengesList.innerHTML = "";
        responseData.forEach(challenge => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="card h-100 d-flex flex-column p-3">
                <h4 class="card-title">${challenge.description}</h4>
                <hr>
                <div class="mt-auto">
                    <p class="card-text text-center">Points: ${challenge.points} Points</p>
                    <button class="btn btn-primary w-100 completeChallengebtn" data-challenge-id="${challenge.challenge_id}">Complete</button>
                </div>    

            </div>
            `;
            challengesList.appendChild(displayItem);
        })
    }

    fetchMethod(currentUrl + "/api/challenges", callback);
}