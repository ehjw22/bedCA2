/**
* Purpose: Fetches and displays the logged-in user's total points on the page.
*          Updates the element with the ID "userPointsDisplay".
*/


function displayPoints() {
    if (localStorage.getItem("token")) {
        const pointsText = document.getElementById("userPointsDisplay")

        // callback to handle api response
        const callback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                // update points display
                pointsText.textContent = `${responseData.points} Points`
            }
        }
        fetchMethod(currentUrl + "/api/user/token", callback, "GET", null, localStorage.getItem("token"));
    }
    
}

document.addEventListener("DOMContentLoaded", displayPoints);