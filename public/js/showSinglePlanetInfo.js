/**
* Purpose: Displays all planted plants on a specific planet.
*          - Fetches planet info and plants for the selected planet.
*          - Displays plant cards with growth progress bars.
*          - Allows planting new plants and deleting existing plants.
*          - Handles token expiration and missing planet cases.
*/

document.addEventListener("DOMContentLoaded", displayAllPlantedPlants)

// fetches and displays all plants for a specific planet
function displayAllPlantedPlants () {
    url = new URL(document.URL);
    const urlParams = url.searchParams;
    const planetId = urlParams.get("planet_id");

    const callbackForPlanetInfo = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const planetInfo = document.getElementById("planetInfo");
        const planetNameElement = document.getElementById("planetName");
        planetInfo.innerHTML = "";
        
        if (responseStatus == 200) {
            planetNameElement.textContent = responseData.planetName;
            console.log(responseData.planetName);
            planetInfo.appendChild(addPlantCard);
            generateSelectOptions(); // populate select box with available plants
            plantPlant(planetId); // attach planting functionality

            // display each planted plant as a card
            responseData.results.forEach(plants => {
                const displayItem = document.createElement("div");
                displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
                const progress = calculateGrowthProgress(
                    plants.planted_on,
                    plants.growthTime
                );
                const progressRounded = Math.floor(progress);

                // format the planted date of the plant
                const plantedDate = new Date(plants.planted_on).toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });

                // rendering the card
                displayItem.innerHTML = `
                <div class="plant-card h-100 d-flex flex-column p-3">
                    <img src="../images/${plants.plantImage}" class="card-img-top mb-2" style="height: 150px; object-fit: cover;">
                    <h4 class="plant-title text-center">${plants.plantName}</h4>
                    <hr>
                    <div class="mt-auto">
                        <p class="plant-date text-center mb-2">Planted On: ${plantedDate}</p>
                        <div class="plant-progress mb-2">
                            <small class="d-block text-center text-light">Growth Progress</small>
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
                                <p class="mb-2">Delete this plant?</p>
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
            
            // initialise delete popovers and attach event listeners
            const deleteButtons = document.querySelectorAll(".delete-btn");

            deleteButtons.forEach(btn => {
                if (!btn.dataset.popoverInitialised) {
                    const popover = new bootstrap.Popover(btn, {
                        trigger: "click",
                        placement: "bottom",
                        sanitize: false // allow html content in popover
                    });
                    btn.dataset.popoverInitialised = true;

                    btn.addEventListener("shown.bs.popover", () => {
                        const popoverElement = document.querySelector(".popover");

                        // cancel delete button
                        popoverElement.querySelector(".cancel-delete")
                        .addEventListener("click", () => popover.hide());

                        // confirm delete button
                        popoverElement.querySelector(".confirm-delete")
                        .addEventListener("click", () => {
                            popover.hide();
                            const callback = (responseStatus, responseData) => {
                                console.log(responseStatus);
                                console.log(responseData);
                                if (responseStatus == 204) {
                                    // refreshes plant list if successful
                                    showToast("Plant successfully removed");
                                    fetchMethod(currentUrl + `/api/user/token/plants/${planetId}`, callbackForPlanetInfo, "GET", null, localStorage.getItem("token"))
                                } else if (responseStatus == 401) {
                                    handleSessionExpired();
                                    toggleNavbar();
                                } else {
                                    showToast(responseData.message, "error");
                                }
                            }

                            // call delete api
                            fetchMethod(currentUrl + `/api/user/token/plants/${btn.dataset.userplantId}`, callback, "DELETE", null, localStorage.getItem("token"));
                        });
                    });
                }
            });
        } else if (responseStatus == 401) {
            handleSessionExpired();
            toggleNavbar();
        } else if (responseStatus == 404 || responseStatus == 400) {
            // handle planet not found or bad request
            const displayItem = document.createElement("div");
            displayItem.innerHTML = `
                <h1 class="text-center">Planet Does Not Exist</h1>
                <p class="text-center mt-2">
                The planet you're looking for could not be found.
                </p>
                <div class="text-center my-4">
                    <a href="planets.html" class="btn btn-primary">Go Back</a>
                </div>
            `;
            planetInfo.appendChild(displayItem);
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
