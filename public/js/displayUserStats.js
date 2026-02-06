/*
* Purpose: Fetches and displays the user's statistics (quests completed, points, experience)
*          on the dashboard. Handles token expiration by clearing it and toggling login state.
*/

/*
* Fetches user stats from the backend and displays them on the page.
*/
const displayUserStats = function() {
    const callback = (responseStatus, responseData) => {
        console.log("Response Status:", responseStatus);
        console.log("Response Data:", responseData);

        if (responseStatus == 200) {
            const userStatsList = document.getElementById("statisticsList")
            userStatsList.innerHTML = "";
            const displayItem = document.createElement("div");
            displayItem.className = "row g-5";
            displayItem.innerHTML = `
            <div class="col-lg-4 col-md-6">
                <div class="stat-box h-100">
                <div class="stat-title">Quests Completed</div>
                <h3 class="stat-value glow">${responseData.total_challenges_completed}</h3>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="stat-box h-100">
                <div class="stat-title">Total Points</div>
                <h3 class="stat-value glow">${responseData.points}</h3>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="stat-box h-100">
                <div class="stat-title">Total Experience</div>
                <h3 class="stat-value glow">${responseData.exp}</h3>
                </div>
            </div>
            `;
            userStatsList.appendChild(displayItem);
        } else if (responseStatus == 401) {
            // Token expired, remove it and update UI accordingly
            localStorage.removeItem('token');
            toggleLoginNStats()
            toggleNavbar();
        }
        
    }

    fetchMethod(currentUrl + `/api/user/token`, callback, "GET", null, localStorage.getItem("token"));

}

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("token")) {
        displayUserStats();
    }
})