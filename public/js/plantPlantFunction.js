/**
* Purpose: Handles planting a selected plant in a specified planet.
*          Submits the plant form via POST request and updates the UI on success.
*/

function plantPlant(planetId) {
    const plantPlantForm = document.getElementById("plantForm");

    // attaches submit listener to the plantform and ensure it is only attached once
    if (!plantPlantForm.dataset.listenerAttached) {
        plantPlantForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const callback = (responseStatus, responseData) => {    
                console.log(responseStatus)
                console.log(responseData)

                if (responseStatus == 201) {
                    showToast(responseData.message);
                    displayAllPlantedPlants();
                } else if (responseStatus == 401) {
                    handleSessionExpired();
                    toggleNavbar();
                }
            }

            // get the selected plant ID from the form
            const plantId = document.getElementById("plantPlantSelect").value;

            fetchMethod(currentUrl + `/api/user/token/plants/${plantId}/plant`, callback, "POST", {planet_id: planetId}, localStorage.getItem("token"));
        })

        // mark listener as attached to prevent duplicate submissions
        plantPlantForm.dataset.listenerAttached = true;
    }   
}