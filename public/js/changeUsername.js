/**
* Purpose: Handles updating the user's username via a PUT request to the backend.
*          Provides feedback to the user using toast notifications and handles
*          session expiration if the token is invalid.
*/

document.addEventListener("DOMContentLoaded", function() {
    const changeUserNameButton = document.getElementById("changeUsernameBtn");
    changeUserNameButton.addEventListener("click", function() {
        const newUsername = document.getElementById("usernameInput");

        // validate input
        if (!newUsername.value.trim()) {
            showToast("Username cannot be empty", "Error");
            return;
        }

        // callback to handle api response
        const callback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                showToast("Username successfully updated");
                newUsername.value = "";
                getUserUsername() // refresh displayed username
            } else if (responseStatus == 401) {
                handleSessionExpired();
            } else {
                showToast(responseData.message, "Error");
            }
            
        }

        // prepare data and send PUT request
        const data = {
            username: newUsername.value
        }

        fetchMethod(currentUrl + `/api/user/token`, callback, "PUT", data, localStorage.getItem("token"));
    })
});