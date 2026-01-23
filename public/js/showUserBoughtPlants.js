const displayAllUserBoughtPlants = function() {
    const userBoughtPlantsDiv = document.getElementById("boughtPlantsList");

    if (!localStorage.getItem("token")) {
        const loginText = document.createElement("h2")
        loginText.textContent = "Login to view bought plants";
        loginText.classList = "text-center"
        userBoughtPlantsDiv.appendChild(loginText);
    } else {
        const callback = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
            userBoughtPlantsDiv.innerHTML = ""
            responseData.forEach(plant => {
                const displayItem = document.createElement("div");
                displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
                displayItem.innerHTML = `
                <div class="card h-100 d-flex flex-column p-3">
                    <h4 class="card-title">${plant.name}</h4>
                    <hr>
                    <div class="mt-auto">
                        <p class="card-text text-center">Quantity: ${plant.quantity}</p>
                        <p class="card-text text-center">Growth Time: ${plant.growth_time_days} Days</p>
                    </div>    
                </div>
                `;
                userBoughtPlantsDiv.appendChild(displayItem);
            })
        }

    fetchMethod(currentUrl + `/api/user/${localStorage.getItem("userId")}/boughtPlants`, callback);
    }
}

document.addEventListener("DOMContentLoaded", displayAllUserBoughtPlants());