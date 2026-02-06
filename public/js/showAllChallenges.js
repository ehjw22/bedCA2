/**
* Purpose: Displays all challenges and handles completing a challenge.
*          Includes:
*          - Rendering challenge cards dynamically
*          - Handling "Complete" button clicks
*          - Submitting reflections and feedback for a challenge
*/

let currentChallengeId = null;

document.addEventListener("DOMContentLoaded", function() {
    const challengesList = document.getElementById("challengesList");
    const completeForm = document.getElementById("completeForm");
    
    // Initially display all challenges
    displayChallenges(challengesList)
    
    // handles click on complete button
    challengesList.addEventListener("click", function(event) {
        if (!event.target.classList.contains("completeChallengebtn")) return;
       
        const token = localStorage.getItem('token');

        if (!token) {
            showToast(`Please <a href="login.html" class="link-light">login</a>/<a href="register.html" class="link-light">register</a> to complete challenges`, "error");
            return;
        }
        currentChallengeId = event.target.dataset.challengeId

        // verify token before showing complete modal
        const callback = (responseStatus, responseData) => {
            console.log(responseData);
            console.log(responseStatus);
            if (responseStatus == 200) {
                const modal = new bootstrap.Modal(document.getElementById("completeModal"));
                modal.show();
            } else if (responseStatus == 401) {
                handleSessionExpired();
                toggleNavbar();
            } 
        }

        fetchMethod(currentUrl + `/api/jwt/verify`, callback, "GET", null, token);
    })

    // handle submission of challenge completion form
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
                displayUserStats(); //refreshes user stats after completion
            }
            console.log(responseStatus)
            console.log(responseData);
        }

        fetchMethod(
            currentUrl + `/api/challenges/${currentChallengeId}`,
            submitCallback,
            "POST",
            data,
            localStorage.getItem("token")
        );        
        
        // reset the form
        completeForm.reset()
    })
    
    
})

// fetches all challenges and dynamically render them as cards
function displayChallenges(challengesList) {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        challengesList.innerHTML = "";

        // create a card for each challenge
        responseData.forEach(challenge => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="challenge-card h-100">
                <h3 class="challenge-title flex-grow-1">${challenge.description}</h3>
                
                <div class="challenge-meta">
                    <span class="difficulty-${challenge.difficulty}">
                        ${challenge.difficulty}
                    </span>
                    <span class="points-badge">⭐ ${challenge.points} Points</span>
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