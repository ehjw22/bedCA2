function plantPlant(planetId) {
    const plantPlantForm = document.getElementById("plantForm");
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
                }
            }
            const plantId = document.getElementById("plantPlantSelect").value;
            fetchMethod(currentUrl + `/api/user/token/plants/${plantId}/plant`, callback, "POST", {planet_id: planetId}, localStorage.getItem("token"));
        })
        plantPlantForm.dataset.listenerAttached = true;
    }
    
}