/**
* Purpose: Fetches and displays all plants bought by the logged-in user.
*          - Hides section if user is not logged in.
*          - Displays a message if no plants have been bought yet.
*          - Handles token expiration.
*/

const displayAllUserBoughtPlants = function() {
    const userBoughtPlantsDiv = document.getElementById("boughtPlantsList");
    const userboughtPlantsSection = document.getElementById("userBoughtPlants");

    // hides section if user is not logged in
    if (!localStorage.getItem("token")) {
        userboughtPlantsSection.classList.add("d-none")
    } else {
        userboughtPlantsSection.classList.remove("d-none")
        const callback = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            if (responseStatus == 401) {
                handleSessionExpired();
                return
            }

            userBoughtPlantsDiv.innerHTML = ""
            
            if (responseData.length == 0) {
                const displayItem = document.createElement("div");
                displayItem.innerHTML = "<p class='text-center'>Bought Plants will appear here.</p>"
                userBoughtPlantsDiv.appendChild(displayItem);
            } else {
                responseData.forEach(plant => {
                    // if plant quantity more than 0, create a card for each one
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

document.addEventListener("DOMContentLoaded", displayAllUserBoughtPlants);