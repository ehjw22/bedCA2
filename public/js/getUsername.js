/**
* Purpose: Fetches the logged-in user's username from the backend and updates all
*          elements with the class "usernameText" on the page.
*/

document.addEventListener("DOMContentLoaded", getUserUsername);

// fetches username of current user and updates the UI
function getUserUsername () {
    const callback = (responseStatus, responseData) => {
        console.log(responseData)
        if (responseStatus == 200) {
            // Update all elements with the username
            const usernames = document.querySelectorAll(".usernameText");
            usernames.forEach(span => {
                span.textContent = responseData.username
            })
        }
    }

    fetchMethod(currentUrl + `/api/user/token`, callback, "GET", null, localStorage.getItem("token"))
}