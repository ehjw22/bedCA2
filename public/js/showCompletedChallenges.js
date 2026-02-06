/**
* Purpose: Fetches and displays all challenges completed by the logged-in user.
*          Shows points earned, completion date, and handles cases where no challenges exist.
*/


document.addEventListener("DOMContentLoaded", showCompletedChallenges)

// fetches completed challenges for the current uesr and renders them as cards
function showCompletedChallenges () {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
            const completedChallengesList = document.getElementById("completedChallengesList");
            completedChallengesList.innerHTML = "";
            responseData.forEach(completion => {
                // format completion date
                const completedDate = new Date(completion.completed_on).toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });
                const displayItem = document.createElement("div");
                displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
                displayItem.innerHTML = `
                <div class="challenge-card completed-challenge p-3">
                    <h4 class="challenge-title flex-grow-1">${completion.challenge}</h4>

                    <div class="challenge-meta">
                        <span class="points-badge">⭐ ${completion.points_earned} pts</span>
                        <span class="completed-badge">Completed</span>
                    </div>    
                    <small class="text-light text-center mt-2">
                        Completed on ${completedDate}
                    </small>
                </div>
                `;
                completedChallengesList.appendChild(displayItem);
            })
            
        } else if (responseStatus == 401) {
            handleSessionExpired();
            toggleNavbar();
        } else if (responseStatus == 404) {
            // no completed challenges yet
            const displayItem = document.createElement("div");
            const completedChallengesList = document.getElementById("completedChallengesList");
            completedChallengesList.innerHTML = "";
            displayItem.innerHTML = `
                <h2 class="text-center">No challenges completed yet.</h2>
                <h2 class="text-center">Complete a challenge to see your progress here.</h2>
            `;
            completedChallengesList.appendChild(displayItem);
        }
        
    }

    fetchMethod(currentUrl + `/api/user/token/completions`, callback, "GET", null, localStorage.getItem('token'));
}