document.addEventListener("DOMContentLoaded", function() {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const plantsList = document.getElementById("plantsContainer");
        responseData.forEach(plant => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="card h-100 d-flex flex-column p-3">
                <h4 class="card-title">${plant.name}</h4>
                <hr>
                <div class="mt-auto">
                    <p class="card-text text-center">Plant Cost: ${plant.plant_cost} Points</p>
                    <button class="btn btn-primary w-100">Buy</button>
                </div>    

            </div>
            `;
            plantsList.appendChild(displayItem);
        })
    }

    fetchMethod(currentUrl + "/api/plants", callback);
})