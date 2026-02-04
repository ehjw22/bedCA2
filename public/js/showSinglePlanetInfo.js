document.addEventListener("DOMContentLoaded", function() {
    displayAllPlantedPlants();
})

function displayAllPlantedPlants () {
    url = new URL(document.URL);
    const urlParams = url.searchParams;
    const planetId = urlParams.get("planet_id");
    const planetName = urlParams.get("planet_name");

    const callbackForPlanetInfo = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const planetInfo = document.getElementById("planetInfo");
        const planetNameElement = document.getElementById("planetName");
        planetInfo.innerHTML = "";
        planetNameElement.textContent = planetName;
        planetInfo.appendChild(addPlantCard);
        generateSelectOptions();
        plantPlant(planetId);
        if (responseStatus == 200) {
            responseData.forEach(plants => {
                const displayItem = document.createElement("div");
                displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
                const progress = calculateGrowthProgress(
                    plants.planted_on,
                    plants.growthTime
                );
                const progressRounded = Math.floor(progress);
                displayItem.innerHTML = `
                <div class="plant-card h-100 d-flex flex-column p-3">
                    <img src="../images/${plants.plantImage}" class="card-img-top mb-2" style="height: 150px; object-fit: cover;">
                    <h4 class="plant-title text-center">${plants.plantName}</h4>
                    <hr>
                    <div class="mt-auto">
                        <p class="plant-date text-center mb-2">Planted On: ${plants.planted_on}</p>
                        <div class="plant-progress mb-2">
                            <small class="text-muted">Growth Progress</small>
                            <div class="progress" style="height: 18px;">
                                <div
                                    class="progress-bar"
                                    role="progressbar"
                                    style="width: ${progressRounded}%"
                                    aria-valuenow="${progressRounded}"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                    ${progressRounded}%
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            class="btn btn-danger delete-btn w-100"
                            data-bs-toggle="popover"
                            data-bs-html="true"
                            data-bs-content='
                                <div class="text-center">
                                <p class="mb-2">Delete this planet?</p>
                                <button class="btn btn-sm btn-danger confirm-delete">Yes</button>
                                <button class="btn btn-sm btn-secondary cancel-delete">Cancel</button>
                                </div>
                            '
                            data-userplant-id="${plants.user_plant_id}"
                            >
                            Delete
                        </button>
                    </div>    
                </div>
                `;
                planetInfo.appendChild(displayItem);
            
            })
            
            const deleteButtons = document.querySelectorAll(".delete-btn");

            deleteButtons.forEach(btn => {
                if (!btn.dataset.popoverInitialised) {
                    const popover = new bootstrap.Popover(btn, {
                        trigger: "click",
                        placement: "bottom",
                        sanitize: false 
                    });
                    btn.dataset.popoverInitialised = true;

                    btn.addEventListener("shown.bs.popover", () => {
                        const popoverElement = document.querySelector(".popover");

                        popoverElement.querySelector(".cancel-delete")
                        .addEventListener("click", () => popover.hide());

                        popoverElement.querySelector(".confirm-delete")
                        .addEventListener("click", () => {
                            popover.hide();
                            console.log("Delete confirmed");
                            // call delete API here
                            const callback = (responseStatus, responseData) => {
                                console.log(responseStatus);
                                console.log(responseData);
                                if (responseStatus == 204) {
                                    showToast("Plant successfully removed");
                                    fetchMethod(currentUrl + `/api/user/token/plants/${planetId}`, callbackForPlanetInfo, "GET", null, localStorage.getItem("token"))
                                } else if (responseStatus == 401) {
                                    handleSessionExpired();
                                } else {
                                    showToast(responseData.message, "error");
                                }
                            }
                            fetchMethod(currentUrl + `/api/user/token/plants/${btn.dataset.userplantId}`, callback, "DELETE", null, localStorage.getItem("token"));
                        });
                    });
                }
            });
        } else if (responseStatus == 401) {
            handleSessionExpired();
        }
        

    }

    fetchMethod(currentUrl + `/api/user/token/plants/${planetId}`, callbackForPlanetInfo, "GET", null, localStorage.getItem("token"))
}

function calculateGrowthProgress(plantedOn, totalDays) {
    const plantedDate = new Date(plantedOn);
    const now = new Date();

    const msPassed = now - plantedDate;
    const daysPassed = msPassed / (1000 * 60 * 60 * 24);

    const progress = (daysPassed / totalDays) * 100;

    return Math.min(Math.max(progress, 0), 100);
}
