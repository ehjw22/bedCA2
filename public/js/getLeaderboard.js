document.addEventListener("DOMContentLoaded", function() {
    const leaderBoardList = document.getElementById("leaderboardBody");
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        leaderBoardList.inenrHTML = "";
        responseData.forEach((user, index) => {
            const row = document.createElement("tr");

            // optional highlight for top 3
            if (index === 0) row.classList.add("table-warning");
            if (index === 1) row.classList.add("table-secondary");
            if (index === 2) row.classList.add("table-light");

            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.level}</td>
            <td>${user.exp}</td>
            <td>${user.total_challenges_completed}</td>
            `;

            leaderboardBody.appendChild(row);
        })
    }

    fetchMethod(currentUrl + '/api/leaderboard', callback);
})
