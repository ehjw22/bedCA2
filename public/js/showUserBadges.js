function displayBadges() {
    const badgesList = document.getElementById("badgesEarnedList");

    const callback = (responseStatus, responseData) => {
        console.log(responseStatus);
        console.log(responseData);

        if (responseStatus == 200) {
            badgesList.innerHTML = "";
            if (responseData.length == 0) {

            } else {
                responseData.forEach(badge => {
                    const displayItem = document.createElement("div");
                    displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
                    displayItem.innerHTML = `
                    <div class="card h-100 d-flex flex-column p-3">
                        <h4 class="card-title">${badge.name}</h4>
                        <hr>
                        <div class="mt-auto">
                            <p class="card-text text-center">${badge.description}</p>
                            <p class="card-text text-center">${badge.earned_on}</p>
                        </div>    

                    </div>
                    `;
                    badgesList.appendChild(displayItem);
                })
            }
        }
    }

    fetchMethod(currentUrl + `/api/user/token/badges`, callback, "GET", null, localStorage.getItem("token"));
}

document.addEventListener("DOMContentLoaded", displayBadges());