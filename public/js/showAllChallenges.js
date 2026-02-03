let currentChallengeId = null;

document.addEventListener("DOMContentLoaded", function() {
    const challengesList = document.getElementById("challengesList");
    const completeForm = document.getElementById("completeForm");
    
    displayChallenges(challengesList)
    
    challengesList.addEventListener("click", function(event) {
        if (!event.target.classList.contains("completeChallengebtn")) return;
       
        const token = localStorage.getItem('token');

        if (!token) {
            showToast(`Please <a href="login.html" class="link-light">login</a>/<a href="register.html" class="link-light">register</a> to complete challenges`, "error");
            return;
        }

        currentChallengeId = event.target.dataset.challengeId
        const modal = new bootstrap.Modal(document.getElementById("completeModal"));
        modal.show();
    })

    completeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const reflection = document.getElementById("reflection").value;
        const difficulty = document.getElementById("difficulty").value;
        const feedback = document.getElementById("feedback").value;

        const data = {
            challenge_id: currentChallengeId,
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
            currentUrl + `/api/challenges/${currentChallengeIdset}`,
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
            <div class="challenge-card h-100">
                <h3 class="challenge-title">${challenge.description}</h3>
                
                <div class="challenge-meta">
                    <span class="points-badge">⭐ ${challenge.points} pts</span>
                    <span class="difficulty-${challenge.difficulty}">
                        ${challenge.difficulty}
                    </span>
                </div>

                <button 
                class="complete-btn completeChallengebtn"
                data-challenge-id="${challenge.challenge_id}">
                Complete
                </button>
            </div>
            `;
            challengesList.appendChild(displayItem);
        })
    }

    fetchMethod(currentUrl + "/api/challenges", callback);
}