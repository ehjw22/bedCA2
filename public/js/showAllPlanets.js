
document.addEventListener("DOMContentLoaded", function() {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        const planetList = document.getElementById("planetContainer");
        const token = localStorage.getItem("token");
        if (!token) {
            const displayItem = document.createElement("div");
            displayItem.innerHTML = `
                <h2 class="text-center">Login/Register to view your planets</h2>
            `;

            planetList.appendChild(displayItem);
            return
        }
        if (responseStatus == 200) {
            responseData.forEach(planet => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="planet-body h-100 d-flex flex-column p-3">
                <img src="../images/${planet.planetImage}" class="planet-img">
                <div class="planet-body d-flex flex-column flex-grow-1">
                    <h4 class="planet-title">${planet.name}</h4>

                    <hr class="planet-divider">

                    <p class="planet-desc text-center">
                        ${planet.description}
                    </p>

                    <div class="mt-auto">
                        <a 
                        href="singlePlanetInfo.html?planet_id=${planet.planetNumber}"
                        class="btn planet-btn w-100 visitPlanetBtn"
                        data-planet-id="${planet.planetNumber}"
                        >
                        🚀 Visit Planet
                        </a>
                    </div>
                </div>
            </div>
            `;
            planetList.appendChild(displayItem);
            })
        } else if (responseStatus == 401) {
            handleSessionExpired();
            toggleNavbar();
        }
    }
    fetchMethod(currentUrl + "/api/user/token/planets", callback, "GET", null, localStorage.getItem("token"));
})