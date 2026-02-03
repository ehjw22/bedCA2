document.addEventListener("DOMContentLoaded", getUserUsername());

function getUserUsername () {
    const callback = (responseStatus, responseData) => {
        console.log(responseData)
        if (responseStatus == 200) {
            const usernames = document.querySelectorAll(".usernameText");
            usernames.forEach(span => {
                span.textContent = responseData.username
            })
        }
    }

    fetchMethod(currentUrl + `/api/user/token`, callback, "GET", null, localStorage.getItem("token"))
}