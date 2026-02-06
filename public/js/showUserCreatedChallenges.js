function displayCreatedChallenges(createdChallengesList) {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        createdChallengesList.innerHTML = "";
        if (responseData.length == 0) {
            const displayItem = document.createElement("div");
            displayItem.innerHTML = `
                <h2 class="text-center">Created challenges will appear here.</h2>
            `
            createdChallengesList.appendChild(displayItem);
            return;
        }
       
        responseData.forEach(challenge => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="challenge-card user-challenge h-100 d-flex flex-column">
                <h4 class="challenge-title">${challenge.description}</h4>

                <div class="challenge-meta mt-auto">
                    <span class="points-badge">⭐ ${challenge.points} pts</span>
                </div>

                <div class="row g-2 mt-3">
                    <div class="col-6">
                        <button
                            type="button"
                            class="btn btn-danger deleteChallengeBtn w-100"
                            data-bs-toggle="popover"
                            data-bs-html="true"
                            data-bs-content='
                                <div class="text-center">
                                <p class="mb-2">Delete this challenge?</p>
                                <button class="btn btn-sm btn-danger confirm-delete">Yes</button>
                                <button class="btn btn-sm btn-secondary cancel-delete">Cancel</button>
                                </div>
                            '
                            data-challenge-id="${challenge.challenge_id}"
                        >
                            Delete
                        </button>
                    </div>
                    <div class="col-6">
                        <button 
                        class="btn btn-primary w-100 updateChallengeBtn"
                        data-challenge-id="${challenge.challenge_id}"
                        >
                        Update
                        </button>
                    </div>
                </div>
            </div>
            `;
            createdChallengesList.appendChild(displayItem);
        })

        const deleteBtns = document.querySelectorAll(".deleteChallengeBtn");

        deleteBtns.forEach(btn => {
            if (!btn.dataset.popoverInitialised) {
                const popoverInstance = new bootstrap.Popover(btn, {
                    trigger: "click",
                    placement: "bottom",
                    sanitize: false 
                });

                btn.dataset.popoverInitialised = true;

                btn.addEventListener("shown.bs.popover", () => {
                    const popoverElement = popoverInstance.tip;

                    const confirmBtn = popoverElement.querySelector(".confirm-delete");
                    const deleteBtn = popoverElement.querySelector(".cancel-delete")

                    deleteBtn.addEventListener("click", () => popoverInstance.hide());

                    if (!confirmBtn.dataset.listenerAttached) {
                        confirmBtn.dataset.listenerAttached = true;
                        confirmBtn.addEventListener("click", () => {
                            popoverInstance.hide();
                            const callbackforDelete = (responseStatus, responseData) => {
                                console.log(responseStatus);
                                console.log(responseData);
                                if (responseStatus == 401) {
                                    handleSessionExpired();
                                    toggleNavbar();
                                    return
                                } else if (responseStatus == 204) {
                                    const createdChallengesList = document.getElementById('createdChallenges')
                                    showCompletedChallenges()
                                    displayCreatedChallenges(createdChallengesList)
                                    showToast("Challenge Successfully Deleted")
                                }
                            }
                            fetchMethod(currentUrl + `/api/challenges/${btn.dataset.challengeId}`, callbackforDelete, "DELETE", null, localStorage.getItem("token"));
                        });
                    }
                    
                });
            }
        })
    }

    fetchMethod(currentUrl +`/api/user/token/challenges`, callback, "GET", null, localStorage.getItem("token"));
}

document.addEventListener("DOMContentLoaded", () => {
    const createdChallengesList = document.getElementById('createdChallenges')
    displayCreatedChallenges(createdChallengesList);
})

let currentChallengeId = null;

document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("updateChallengeBtn")) return;
    currentChallengeId = event.target.dataset.challengeId;

    const callback = (responseStatus, responseData) => {
        if (responseStatus == 200) {
            const modal = new bootstrap.Modal(document.getElementById("updateChallengeModal"));
            modal.show();
            document.getElementById("challengeDescription").value = responseData.description;
            document.getElementById("challengeDifficulty").value = responseData.difficulty.toLowerCase();
            document.getElementById("challengePoints").value = responseData.points;
        } else if (responseStatus == 401) {
            handleSessionExpired();
            toggleNavbar();
        }
    }
    fetchMethod(currentUrl + `/api/challenges/${currentChallengeId}`, callback, "GET", null, localStorage.getItem("token"));
    
})

const updateChallengeForm = document.getElementById("updateChallengeForm");

updateChallengeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const description = document.getElementById("challengeDescription").value;
    const difficulty = document.getElementById("challengeDifficulty").value;
    const points = document.getElementById("challengePoints").value;

    const data = {
        description,
        difficulty,
        points
    }

    const callback = (responseStatus, responseData) => {
        console.log(responseStatus);
        console.log(responseData);
        if (responseStatus == 200) {
            const createdChallengesList = document.getElementById('createdChallenges');
            bootstrap.Modal.getInstance(document.getElementById("updateChallengeModal")).hide();
            showCompletedChallenges();
            displayCreatedChallenges(createdChallengesList);
        }
    }

    fetchMethod(currentUrl + `/api/challenges/${currentChallengeId}`, callback, "PUT", data, localStorage.getItem("token"));

})