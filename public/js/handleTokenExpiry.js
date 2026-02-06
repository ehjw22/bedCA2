/**
* Purpose: Handles session expiration by clearing the user's token
*          and showing a modal that prompts the user to either return
*          home or sign in again.
*/

// clears the users token and shows the session expired modal
function handleSessionExpired() {
    localStorage.removeItem("token"); //removes token

    const modal = new bootstrap.Modal(
        document.getElementById("sessionExpiredModal")
    );

    modal.show();
}



document.addEventListener("DOMContentLoaded", function() {

    // redirect to home page if go home button is clicked
    document.getElementById("goHomeBtn").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // redirect to login page if sign in button is selected
    document.getElementById("signInBtn").addEventListener("click", () => {
        window.location.href = "login.html";
    });
})  