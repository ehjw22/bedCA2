function showToast(message, type="success") {
    const toast = document.getElementById("messageToast");

    const toastBody = toast.querySelector(".toast-body");
    toastBody.textContent = message;

    toastBody.classList.remove("text-bg-success", "text-bg-danger");

    if (type == "success") {
        toastBody.classList.add("text-bg-success");
    } else {
        toastBody.classList.add("text-bg-danger");
    }
    const messageToast = new bootstrap.Toast(toast);
    messageToast.show();
}