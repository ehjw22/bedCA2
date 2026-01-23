document.addEventListener("DOMContentLoaded", function() {

    const plantsList = document.getElementById("plantsContainer");

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        responseData.forEach(plant => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="card h-100 d-flex flex-column p-3">
                <h4 class="card-title">${plant.name}</h4>
                <hr>
                <div class="mt-auto">
                    <p class="card-text text-center">Plant Cost: ${plant.plant_cost} Points</p>
                    <button class="btn btn-primary w-100 buyPlantBtn" data-plant-id="${plant.plant_id}">Buy</button>
                </div>    

            </div>
            `;
            plantsList.appendChild(displayItem);
        })
    }

    plantsList.addEventListener("click", function(event) {
        if (!event.target.classList.contains("buyPlantBtn")) return;

        const token = localStorage.getItem('token');

        if (!token) {
            showLoginToast();
            return;
        }

        const callback = (responseStatus, responseData) => {
            console.log(responseStatus);
            console.log(responseData);
            if (responseStatus == 201) {
                displayAllUserBoughtPlants();
                showMessageToast(responseData.message);
                console.log("bought successfully");
            } else {
                showMessageToast(responseData.message, "Error")
            }
        }
        fetchMethod(currentUrl + `/api/user/${localStorage.getItem("userId")}/plants/${event.target.dataset.plantId}/buy`, callback, "POST")

    })

    function showLoginToast() {
        const toast = new bootstrap.Toast(document.getElementById("loginToast"));
        toast.show();
    }

    function showMessageToast(text, type="success") {
        const toast = document.getElementById("messageToast");
        const toastBody = toast.querySelector(".toast-body");

        toastBody.textContent = text;

        toastBody.classList.remove("text-bg-success", "text-bg-danger");

        if (type === "success") {
            toastBody.classList.add("text-bg-success");
        } else {
            toastBody.classList.add("text-bg-danger")
        }
        const displayToast = new bootstrap.Toast(toast);
        displayToast.show();
    }

    fetchMethod(currentUrl + "/api/plants", callback);
})