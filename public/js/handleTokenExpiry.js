function handleSessionExpired() {
    localStorage.removeItem("token");

    const modal = new bootstrap.Modal(
        document.getElementById("sessionExpiredModal")
    );

    modal.show();
}



document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("goHomeBtn").addEventListener("click", () => {
        window.location.href = window.location.href;
    });

    document.getElementById("signInBtn").addEventListener("click", () => {
        window.location.href = "login.html";
    });
})  