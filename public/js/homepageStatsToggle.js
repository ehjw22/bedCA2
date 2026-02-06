/**
* Purpose: Toggles the visibility of the login section and the statistics card
*          on the homepage based on whether the user is logged in (token exists).
*/

document.addEventListener("DOMContentLoaded", toggleLoginNStats);


// shows or hides element based on login state
function toggleLoginNStats() {
  const loginDiv = document.getElementById("loginDirect");
    const statsDiv = document.getElementById("statisticsCard")
  // Check if token exists in local storage
  const token = localStorage.getItem("token");

  if (token) {
    // Token exists
    loginDiv.classList.add("d-none");
    statsDiv.classList.remove("d-none")
  } else {
    // Token does not exist
    loginDiv.classList.remove("d-none");
    statsDiv.classList.add("d-none")
  }
}