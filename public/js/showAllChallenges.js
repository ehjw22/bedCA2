// document.addEventListener("DOMContentLoaded", function() {
//     const callback = (responseStatus, responseData) => {
//         console.log("responseStatus:", responseStatus);
//         console.log("responseData:", responseData);

//         const challengesList = document.getElementById("challengesContainer");
//         responseData.forEach(challenge => {
//             const displayItem = document.createElement("div");
//             displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
//             displayItem.innerHTML = `
//             <div class="card h-100 d-flex flex-column">
//                 <div class="card-body">
//                     <h3 class="card-title">${challenge.description}</h3>
//                     <hr class="card-divider">
//                     <p class="card-text"> Points: ${challenge.points} </p>
//                 </div>

//             </div>
//             `;
//             challengesList.appendChild(displayItem);
//         })
//     }

//     fetchMethod(currentUrl + "/api/challenges", callback);
// })
document.addEventListener("DOMContentLoaded", function() {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const challengesList = document.getElementById("challengesContainer");
        responseData.forEach(challenge => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-3 col-lg-4 col-md-6 p-3";
            displayItem.innerHTML = `
            <div class="card h-100 d-flex flex-column p-3">
                <h4 class="card-title">${challenge.description}</h4>
                <hr>
                <div class="mt-auto">
                    <p class="card-text text-center">Points: ${challenge.points} Points</p>
                    <button class="btn btn-primary w-100">Complete</button>
                </div>    

            </div>
            `;
            challengesList.appendChild(displayItem);
        })
    }

    fetchMethod(currentUrl + "/api/challenges", callback);
})