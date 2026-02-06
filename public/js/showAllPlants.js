document.addEventListener("DOMContentLoaded", function() {
    const plantsList = document.getElementById("plantsContainerList");

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        plantsList.innerHTML = ""
        responseData.forEach(plant => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="plant-card h-100">
                <img src="../images/${plant.plantImage}" class="plant-img">
                <div class="plant-body">
                    <h3 class="plant-title">${plant.name}</h3>

                    <div class="mt-auto">
                        <p class="plant-price">Price: ${plant.plant_cost} points</p>
                        <p>Growth Time: ${plant.growth_time_days} Days</p>
                        <hr class="divider">
                        <button 
                        class="btn btn-buy buyPlantBtn" 
                        data-plant-id="${plant.plant_id}">
                        Buy
                        </button>
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
                displayPoints();
            } else if (responseStatus == 401) {
                handleSessionExpired();
                toggleNavbar();
            } else {
                showMessageToast(responseData.message, "Error")
            }
        }
        fetchMethod(currentUrl + `/api/user/token/plants/${event.target.dataset.plantId}/buy`, callback, "POST", null, localStorage.getItem("token"))

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