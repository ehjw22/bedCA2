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
        if (responseData.length == 0) {
            const displayItem = document.createElement("div");
            displayItem.innerHTML = `
                <h2 class="text-center">Start planting plants and view it here</h2>
            `
            planetInfo.appendChild(displayItem)
        } else {
            responseData.forEach(plants => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="card h-100 d-flex flex-column p-3">
                <h4 class="card-title text-center">${plants.plantName}</h4>
                <hr>
                <div class="mt-auto">
                    <p class="card-text text-center">Planted On: ${plants.planted_on}</p>
                    <p class="card-text text-center">Growth Stage: ${plants.growth_stage}</p>
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
        }
        

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
                            } else {
                                showToast(responseData.message, "error");
                            }
                        }
                        fetchMethod(currentUrl + `/api/user/token/plants/${btn.dataset.userplantId}`, callback, "DELETE", null, localStorage.getItem("token"));
                    });
                });
            }
        });

    }

    fetchMethod(currentUrl + `/api/user/token/plants/${planetId}`, callbackForPlanetInfo, "GET", null, localStorage.getItem("token"))
}