document.addEventListener("DOMContentLoaded", function() {
    const leaderBoardList = document.getElementById("completedChallengesLeaderboard");
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        leaderBoardList.innerHTML = "";
        responseData.forEach((user, index) => {
            const row = document.createElement("tr");

            if (index === 0) row.classList.add("table-warning");
            if (index === 1) row.classList.add("table-secondary");
            if (index === 2) row.classList.add("table-light");

            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td class="text-center">${user.total_challenges_completed}</td>
            `;

            leaderBoardList.appendChild(row);
        })
    }

    fetchMethod(currentUrl + '/api/leaderboard/challenge', callback);
})
