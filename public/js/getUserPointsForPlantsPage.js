function displayPoints() {
    if (localStorage.getItem("token")) {
        const pointsText = document.getElementById("userPointsDisplay")
        const callback = (responseStatus, responseData) => {
            console.log("this one")
            console.log(responseData)
            if (responseStatus == 200) {
                pointsText.textContent = `${responseData.points} Points`
            }
        }
        fetchMethod(currentUrl + "/api/user/token", callback, "GET", null, localStorage.getItem("token"));
    }
    
}

document.addEventListener("DOMContentLoaded", displayPoints);