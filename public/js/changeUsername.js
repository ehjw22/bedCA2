document.addEventListener("DOMContentLoaded", function() {
    const changeUserNameButton = document.getElementById("changeUsernameBtn");
    changeUserNameButton.addEventListener("click", function() {
        const newUsername = document.getElementById("usernameInput");
        const callback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                showToast("Username successfully updated");
                newUsername.value = "";
                getUserUsername()
            } else {
                showToast(responseData.message, "Error");
            }
            
        }

        const data = {
            username: newUsername.value
        }

        fetchMethod(currentUrl + `/api/user/token`, callback, "PUT", data, localStorage.getItem("token"));
    })
});