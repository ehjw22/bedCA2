document.addEventListener("DOMContentLoaded", function () {
    const loginDiv = document.getElementById("loginDirect");
    const statsDiv = document.getElementById("statisticsCard")
  // Check if token exists in local storage
  const token = localStorage.getItem("token");

  if (token) {
    // Token exists, show profile button and hide login and register buttons
    loginDiv.classList.add("d-none");
    statsDiv.classList.remove("d-none")
  } else {
    // Token does not exist, show login and register buttons and hide profile and logout buttons
    loginDiv.classList.remove("d-none");
    statsDiv.classList.add("d-none")
  }
});