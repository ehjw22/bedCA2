/**
* Purpose: Displays a Bootstrap toast notification with a custom message and type.
*          Supports "success" (green) and "error" (red) styles.
*/

function showToast(message, type="success") {
    const toast = document.getElementById("messageToast");

    // set the message
    const toastBody = toast.querySelector(".toast-body");
    toastBody.innerHTML = message;

    toastBody.classList.remove("text-bg-success", "text-bg-danger");

    // apply styling based on type
    if (type == "success") {
        toastBody.classList.add("text-bg-success");
    } else {
        toastBody.classList.add("text-bg-danger");
    }

    // initialize and show toast
    const messageToast = new bootstrap.Toast(toast);
    messageToast.show();
}