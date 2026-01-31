document.addEventListener("DOMContentLoaded", function() {
    url = new URL(document.URL);
    const urlParams = url.searchParams;
    const planetId = urlParams.get("planet_id");

    const callbackForPlanetInfo = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const planetInfo = document.getElementById("planetInfo");
        const planetName = document.getElementById("planetName");
        planetInfo.innerHTML = "";

        responseData.forEach(plants => {
            if (plants.planet_id == planetId) {
                planetName.textContent = plants.planetName
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
                            data-plant-id="${plants.plant_id}"
                            >
                            Delete
                        </button>
                    </div>    
                </div>
                `;
                planetInfo.appendChild(displayItem);
            }
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
                                fetchMethod(currentUrl + `/api/user/token/plants`, callbackForPlanetInfo, "GET", null, localStorage.getItem("token"))
                            } else {
                                showToast(responseData.message, "error");
                            }
                        }
                        console.log(btn.dataset.plantId)
                        fetchMethod(currentUrl + `/api/user/token/plants/${btn.dataset.plantId}`, callback, "DELETE", null, localStorage.getItem("token"));
                    });
                });
            }
        });

    }

    fetchMethod(currentUrl + `/api/user/token/plants`, callbackForPlanetInfo, "GET", null, localStorage.getItem("token"))
})