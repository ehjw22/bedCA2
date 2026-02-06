/**
* Purpose: Handles creating new challenges, including:
*          - Verifying user token before allowing challenge creation
*          - Submitting new challenges via POST request
*          - Displaying similar challenge suggestions with debounce
*/


document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", function (event) {
        if (event.target.id !== "createChallengeBtn") return;

        const token = localStorage.getItem("token");

        if (!token) {
            showToast(`Please <a href="login.html" class="link-light">login</a>/<a href="register.html" class="link-light">register</a> to create challenges`, "error");
            return;
        }
        
        // Verify token before showing modal
        const callback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                const modal = new bootstrap.Modal(document.getElementById("createChallengeModal"));
                modal.show();
            } else if (responseStatus == 401) {
                handleSessionExpired();
                toggleNavbar();
            }
        }

        fetchMethod(currentUrl + `/api/jwt/verify`, callback, "GET", null, token);
    })

    // handle submission of new challenge form
    const newChallengeForm = document.getElementById("createChallengeForm");

    newChallengeForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const description = document.getElementById("challengeDescription").value;
        const points = document.getElementById("challengePoints").value;
        const difficulty = document.getElementById("challengeDifficulty").value;

        const data = {
            description,
            points,
            difficulty
        };

        // callback to handle challenge creation response
        const callback = (responseStatus, responseData) => {
            if (responseStatus == 201) {
                showToast("Challenge successfully created")
                bootstrap.Modal.getInstance(document.getElementById("createChallengeModal")).hide()
                displayChallenges(document.getElementById("challengesList"));
            } else {
                showToast(responseData.message || responseData.error, "error");
            }
        }

        fetchMethod(currentUrl + `/api/challenges`, callback, "POST", data, localStorage.getItem("token"));
    })

    // handle similar challenges suggestions as user types
    const descriptionInput = document.getElementById("challengeDescription");
    const similarBox = document.getElementById("similarChallengesBox");

    let debounceTimer;

    descriptionInput.addEventListener("input", function () {
        const inputText = this.value.trim();
        console.log(inputText);

        // clear previous debounce
        clearTimeout(debounceTimer);

        if (inputText.length < 3) {
            similarBox.innerHTML = ""; // clear suggestions for short text
            return;
        }

        // debounce request by 300ms to reduce api calls
        debounceTimer = setTimeout(() => {
            const data = { text: inputText };

            const callback = (responseStatus, responseData) => {
                console.log(responseData)
                if (responseStatus === 200 && responseData.length > 0) {
                    similarBox.innerHTML = responseData
                        .map(ch => `<div class="similar-item">${ch.description}</div>`)
                        .join("");
                } else {
                    similarBox.innerHTML = "<div class='text-light'>No similar challenges</div>";
                }
            }

            fetchMethod(currentUrl + "/api/challenges/similarChallenges", callback, "POST", data);

        }, 300); // 300ms debounce
    });
})