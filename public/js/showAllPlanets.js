
document.addEventListener("DOMContentLoaded", function() {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const planetList = document.getElementById("planetContainer");
        responseData.forEach(planet => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="card h-100 d-flex flex-column p-3">
                <h4 class="card-title">${planet.name}</h4>
                <hr>
                <div class="mt-auto">
                    <p class="card-text text-center">${planet.description}</p>
                    <a href="singlePlanetInfo.html?planet_id=${planet.planet_id}" class="btn btn-primary w-100 visitPlanetBtn" data-planet-id="${planet.planet_id}">Visit Planet</a>
                </div>    
            </div>
            `;
            planetList.appendChild(displayItem);
        })
    }

    fetchMethod(currentUrl + "/api/user/token/planets", callback, "GET", null, localStorage.getItem("token"));
})