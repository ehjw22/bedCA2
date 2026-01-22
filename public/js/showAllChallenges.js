document.addEventListener("DOMContentLoaded", function() {
    const challengesList = document.getElementById("challengesContainer");
    const completeForm = document.getElementById("completeForm")

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        responseData.forEach(challenge => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="card h-100 d-flex flex-column p-3">
                <h4 class="card-title">${challenge.description}</h4>
                <hr>
                <div class="mt-auto">
                    <p class="card-text text-center">Points: ${challenge.points} Points</p>
                    <button class="btn btn-primary w-100 completeChallengebtn" data-challenge-id="${challenge.challenge_id}">Complete</button>
                </div>    

            </div>
            `;
            challengesList.appendChild(displayItem);
        })
    }

    challengesList.addEventListener("click", function(event) {
        if (!event.target.classList.contains("completeChallengebtn")) return;
       
        const token = localStorage.getItem('token');

        if (!token) {
            showLoginToast();
            return;
        }

        localStorage.setItem("currentChallengeId", event.target.dataset.challengeId);

        const modal = new bootstrap.Modal(document.getElementById("completeModal"));
        modal.show();
    })

    completeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const reflection = document.getElementById("reflection").value;
        const difficulty = document.getElementById("difficulty").value;
        const feedback = document.getElementById("feedback").value;

        const challengeId = localStorage.getItem("currentChallengeId");

        const data = {
            user_id: localStorage.getItem("userId"),
            challenge_id: challengeId,
            details: reflection,
            difficulty,
            feedback
        };

        const submitCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                showSuccessToast();
                bootstrap.Modal.getInstance(document.getElementById("completeModal")).hide();
            }
            console.log(responseStatus)
            console.log(responseData);
        }

        fetchMethod(
            currentUrl + `/api/challenges/${challengeId}`,
            submitCallback,
            "POST",
            data
        );        
        completeForm.reset()
    })

    function showLoginToast() {
        const toast = new bootstrap.Toast(document.getElementById("loginToast"));
        toast.show();
    }

    function showSuccessToast() {
        const toast = new bootstrap.Toast(document.getElementById("successToast"));
        toast.show();
    }
    
    fetchMethod(currentUrl + "/api/challenges", callback);
})

// document.addEventListener("click", function () {
//     const callback = (responseStatus, responseData) => {
//         console.log("responseStatus:", responseStatus);
//         console.log("responseData:", responseData);
//     }
    
//     const data = {
//         user_id: localStorage.getItem('userId')
//     }

//     fetchMethod(currentUrl + `/api/challenges/${localStorage.getItem('userId')}`, callback, "POST", data);
// })

