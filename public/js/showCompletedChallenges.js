document.addEventListener("DOMContentLoaded", function() {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const completedChallengesList = document.getElementById("completedChallenges");
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

    fetchMethod(currentUrl + `/api/user/token/completions`, callback, "GET", null, localStorage.getItem('token'));
})