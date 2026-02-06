const displayAllUserBoughtPlants = function() {
    const userBoughtPlantsDiv = document.getElementById("boughtPlantsList");
    const userboughtPlantsSection = document.getElementById("userBoughtPlants");
    if (!localStorage.getItem("token")) {
        userboughtPlantsSection.classList.add("d-none")
    } else {
        userboughtPlantsSection.classList.remove("d-none")
        const callback = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
            userBoughtPlantsDiv.innerHTML = ""

            if (responseData.length == 0) {
                const displayItem = document.createElement("div");
                displayItem.textContent = "Bought Plants will appear here."
            } else {
                responseData.forEach(plant => {
                    if (plant.quantity != 0) {
                        const displayItem = document.createElement("div");
                        displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
                        displayItem.innerHTML = `
                        <div class="plant-info-card h-100 d-flex flex-column p-3">
                            <h4 class="card-title">${plant.name}</h4>
                            <hr>
                            <div class="mt-auto">
                                <p class="card-text text-center">Quantity: ${plant.quantity}</p>
                            </div>    
                        </div>
                        `;
                        userBoughtPlantsDiv.appendChild(displayItem);
                    }
                })
            }
            
        }

        fetchMethod(currentUrl + `/api/user/token/boughtPlants`, callback, "GET", null, localStorage.getItem("token"));
    }
}

document.addEventListener("DOMContentLoaded", displayAllUserBoughtPlants());