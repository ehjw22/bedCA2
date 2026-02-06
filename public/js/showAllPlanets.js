/**
* Purpose: Fetches and displays all planets associated with the logged-in user.
*          If the user is not logged in, prompts them to login/register.
*          Each planet card includes a "Visit Planet" button linking to detailed info.
*/

document.addEventListener("DOMContentLoaded", function() {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        const planetList = document.getElementById("planetContainer");
        const token = localStorage.getItem("token");

        // If user is not logged in, show a message
        if (!token) {
            const displayItem = document.createElement("div");
            displayItem.innerHTML = `
                <h2 class="text-center mb-3">🚀 Login to view your planets, or register to start your cosmic journey!</h2>
            `;

            planetList.appendChild(displayItem);
            return
        }
        if (responseStatus == 200) {

            // create a card for each planet
            responseData.forEach(planet => {
                const displayItem = document.createElement("div");
                displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
                displayItem.innerHTML = `
                <div class="planet-body h-100 d-flex flex-column p-3">
                    <img src="../images/${planet.planetImage}" class="planet-img">
                    <div class="planet-body d-flex flex-column flex-grow-1">
                        <h4 class="planet-title">${planet.name}</h4>

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
        } else if (responseStatus == 401) { //handle token expiration
            handleSessionExpired();
            toggleNavbar();
        }
    }
    fetchMethod(currentUrl + "/api/user/token/planets", callback, "GET", null, localStorage.getItem("token"));
})