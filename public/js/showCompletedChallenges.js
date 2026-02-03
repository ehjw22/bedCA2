document.addEventListener("DOMContentLoaded", function() {
    showCompletedChallenges();
})

function showCompletedChallenges () {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
            const completedChallengesList = document.getElementById("completedChallengesList");
            completedChallengesList.innerHTML = "";
            if (responseData.length !== 0) {    
                responseData.forEach(completion => {
                    const displayItem = document.createElement("div");
                    displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
                    displayItem.innerHTML = `
                    <div class="challenge-card completed-challenge p-3">
                        <h4 class="challenge-title flex-grow-1">${completion.challenge}</h4>

                        <div class="challenge-meta">
                            <span class="points-badge">⭐ ${completion.points_earned} pts</span>
                            <span class="completed-badge">Completed</span>
                        </div>    

                    </div>
                    `;
                    completedChallengesList.appendChild(displayItem);
                })
            } 
        } else if (responseStatus == 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        } else if (responseStatus == 404) {
            
            const displayItem = document.createElement("div");
            const completedChallengesList = document.getElementById("completedChallengesList");
            completedChallengesList.innerHTML = "";
            displayItem.innerHTML = `
                <h2 class="text-center">No challenges completed yet.</h2>
                <h2 class="text-center">Complete a challenge to see your progress here</h2>
            `;
            completedChallengesList.appendChild(displayItem);
        }
        
    }

    fetchMethod(currentUrl + `/api/user/token/completions`, callback, "GET", null, localStorage.getItem('token'));
}