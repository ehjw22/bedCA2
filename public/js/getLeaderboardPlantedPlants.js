/*
* Purpose: Fetches and displays the leaderboard of users based on the number of plants they have planted.
*          Highlights the top 3 users with different table row styles.
*/

document.addEventListener("DOMContentLoaded", function() {
    const plantedPlantsUserList = document.getElementById("plantedPlantsLeaderboard");

    // Callback to handle leaderboard API response
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        plantedPlantsUserList.innerHTML = "";
        responseData.forEach((user, index) => {
            const row = document.createElement("tr");

            if (index === 0) row.classList.add("table-warning");
            if (index === 1) row.classList.add("table-secondary");
            if (index === 2) row.classList.add("table-light");

            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td class="text-center">${user.plant_count}</td>
            `;

            plantedPlantsUserList.appendChild(row);
        })
    }

    fetchMethod(currentUrl + '/api/leaderboard/byPlantPlanted', callback);
})
