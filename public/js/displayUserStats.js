const displayUserStats = function() {
    const callback = (responseStatus, responseData) => {
        console.log("Response Status:", responseStatus);
        console.log("Response Data:", responseData);

        const userStatsList = document.getElementById("statisticsList")

        const displayItem = document.createElement("div");
        displayItem.className = "row g-5";
        displayItem.innerHTML = `
        <div class="col-md-4">
            <div class="stat-box h-100">
            <div class="stat-title">Quests Completed</div>
            <div class="stat-value glow">${responseData.total_challenges_completed}</div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="stat-box h-100">
            <div class="stat-title">Total Points</div>
            <div class="stat-value glow">${responseData.points}</div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="stat-box h-100">
            <div class="stat-title">Total Experience</div>
            <div class="stat-value glow">${responseData.exp}</div>
            </div>
        </div>
        `;
        userStatsList.appendChild(displayItem);
    }

    fetchMethod(currentUrl + `/api/user/token`, callback, "GET", null, localStorage.getItem("token"));
    // fetchMethod(currentUrl + `/api/user/${localStorage.getItem("userId")}`, callback, null, localStorage.getItem("token"));

}

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("token")) {
        displayUserStats();
    }
})