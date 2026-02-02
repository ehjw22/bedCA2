const addPlantCard = document.createElement("div");

addPlantCard.classList = "col-xl-3 col-lg-4 col-md-6 p-3";

addPlantCard.innerHTML = `
<div class="card h-100 d-flex flex-column p-3">

    <h4 class="card-title text-center">Plant a New Plant</h4>
    <hr>

    <form id="plantForm" class="d-flex flex-column h-100">

        <div class="mb-3">
            <select class="form-select" name="plant_id" id="plantPlantSelect" required>
                <!-- dynamically generated options -->
                <option value="" disabled selected hidden>Select Plant</option>
            </select>
        </div>

        <!-- Push button to bottom like other cards -->
        <div class="mt-auto">
            <button type="submit" class="btn btn-success w-100">
                Plant 🌱
            </button>
        </div>

    </form>

</div>
`
function generateSelectOptions () {
    const callback = (responseStatus, responseData) => {
        console.log(responseData);
        const selectBox = document.getElementById("plantPlantSelect")
        responseData.forEach(plant => {
            if (plant.quantity != 0) {
                const option = document.createElement("option");
                option.value = plant.plant_id;
                option.textContent = plant.name;
                selectBox.appendChild(option)
            }
        })
    }
    fetchMethod(currentUrl + `/api/user/token/boughtPlants`, callback, "GET", null, localStorage.getItem("token"));
}