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
                    <div class="card h-100 d-flex flex-column p-3">
                        <h4 class="card-title">${completion.challenge}</h4>
                        <hr>
                        <div class="mt-auto">
                            <p class="card-text text-center">Points earned: ${completion.points_earned}</p>
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
                <h2 class="text-center">Compelte a challenge to see your progress here</h2>
            `;
            completedChallengesList.append(displayItem);
        }
        
    }

    fetchMethod(currentUrl + `/api/user/token/completions`, callback, "GET", null, localStorage.getItem('token'));
}