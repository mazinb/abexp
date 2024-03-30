// Function to toggle visibility of the API response section
function toggleExperience() {
    var expSection = document.getElementById('expSection');
    expSection.classList.toggle('active');
}

// Function to generate a random user ID or retrieve existing user ID from cookie
function generateUserID() {
    var userID = getCookie('userID');
    if (!userID) {
        userID = Math.random().toString(36).substr(2, 9);
        // Set user ID cookie with expiration time (1 year)
        setCookie('userID', userID, 365);
    } else {
        console.log("Existing User ID retrieved:", userID);
    }
    return userID;
}

// Function to update the banner text with formatted user ID
function updateBanner() {
    var userID = generateUserID();
    var bannerText = document.getElementById('bannerText');
    fetch('/allocation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userID })
    })
    .then(response => response.json())
    .then(data => {
        if (data.experimentInfo.variant === "B") {
            bannerText.innerHTML = "You are on the B side, User ID: <strong>" + userID + "</strong>";
            banner.style.backgroundColor = 'blue';
        } else {
            bannerText.innerHTML = "You are on the A side, User ID: <strong>" + userID + "</strong>";
            banner.style.backgroundColor = 'green';
        }
    });
}

// Call updateBanner() when the page loads
updateBanner();

// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration for one year
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Function to generate the JSON object with actual user ID
function generateJSON() {
    var userID = generateUserID(); // Retrieve user ID from the cookie
    var jsonObject = {
        "status": "success",
        "experimentInfo": {
            "experimentName": "MyFirstExperiment",
            "experimentId": 17945202,
            "userId": userID, // Replace 'user1' with actual user ID
            "variant": "A"
        }
    };
    return JSON.stringify(jsonObject, null, 2); // Pretty print JSON with 2-space indentation
}

// Function to update the expResponse div with the generated JSON
function updateJSON() {
    var jsonText = generateJSON();
    var expResponse = document.getElementById('expResponse');
    expResponse.textContent = jsonText;
}

// Call updateJSON() when the page loads
updateJSON();

// Function to toggle between experiences
function changeExperience() {
    var banner = document.getElementById('banner');
    var bannerText = document.getElementById('bannerText');
    var button = document.getElementById('changeExperienceButton');
    
    var userID = generateUserID(); // Retrieve user ID from the cookie
    
    if (banner.style.backgroundColor === 'green') {
        // Change to B side
        banner.style.backgroundColor = 'blue';
        bannerText.innerHTML = "You are on the B side, User ID: <strong>" + userID + "</strong>";
        
        // Update JSON object for B variant
        var jsonObject = {
            "status": "success",
            "experimentInfo": {
                "experimentName": "MyFirstExperiment",
                "experimentId": 17945202,
                "userId": userID,
                "variant": "B" // Update variant to B
            }
        };
    } else {
        // Change to A side
        banner.style.backgroundColor = 'green';
        bannerText.innerHTML = "You are on the A side, User ID: <strong>" + userID + "</strong>";
        
        // Update JSON object for A variant
        var jsonObject = {
            "status": "success",
            "experimentInfo": {
                "experimentName": "MyFirstExperiment",
                "experimentId": 17945202,
                "userId": userID,
                "variant": "A" // Update variant to A
            }
        };
    }
    
    // Update the expResponse div with the updated JSON
    updateJSON(jsonObject);
}

// Function to update the expResponse div with the generated JSON
function updateJSON(jsonObject) {
    var jsonText = JSON.stringify(jsonObject, null, 2);
    var expResponse = document.getElementById('expResponse');
    expResponse.textContent = jsonText;
}

// Call updateJSON() when the page loads with initial JSON object for variant A
var initialJsonObject = {
    "status": "success",
    "experimentInfo": {
        "experimentName": "MyFirstExperiment",
        "experimentId": 17945202,
        "userId": generateUserID(), // Retrieve user ID from the cookie
        "variant": "A" // Initial variant is A
    }
};
updateJSON(initialJsonObject);

// Function to submit data to create experiment
async function submitExperiment(event) {
    event.preventDefault();
    const experimentName = document.getElementById('experimentName').value;
    try {
        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "experimentName": experimentName })
        });
    
        const data = await response.json();
        const message = document.createElement('div');

        if (response.ok) {
            const experimentInfo = data.experimentInfo;
            message.textContent = `Experiment created successfully! Name: ${experimentInfo.experimentName}, Experiment ID: ${experimentInfo.experimentId}. Please save the experiment Name and ID if you want to use it.`;
            trackEvent('experiment_created', experimentInfo);
            // Hide the createExperimentForm
            const createExperimentForm = document.getElementById('createExperimentForm');
            createExperimentForm.style.display = 'none';
            // Create a button to view experiment details
            const viewButton = document.createElement('button');
            viewButton.textContent = 'View Experiment Details';
            viewButton.addEventListener('click', () => {
                // Redirect to the data page with query parameters
                trackEvent('route_to_exp_data',experimentInfo);
                window.location.href = `/data?experimentName=${experimentInfo.experimentName}&experimentId=${experimentInfo.experimentId}`;
            });
            message.appendChild(viewButton);

        } else if (response.status === 422) {
            const errorMessage = data.message;
            message.textContent = `Failed to create experiment: ${errorMessage}`;
            trackEvent('experiment_creation_failed', errorMessage);
        }
        message.classList.add('success-message');
        messageContainer.appendChild(message);
    } catch (error) {
        console.error('Error creating experiment:', error);
        alert('Failed to create experiment. Please try again.');
    }
}


// Function to track events and store them in local storage
function trackEvent(eventType, eventData) {
    const event = {
        type: eventType,
        timestamp: new Date(),
        data: eventData
    };

    // Retrieve existing events from local storage
    let events = JSON.parse(localStorage.getItem('events')) || [];
    
    // Add the new event to the events array
    events.push(event);
    
    // Store the updated events array back to local storage
    localStorage.setItem('events', JSON.stringify(events));
}

// Attach event listeners to relevant elements
document.addEventListener('DOMContentLoaded', function () {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        element.addEventListener('click', function (event) {
            trackEvent('click', { target: event.target.tagName, id: event.target.id });
        });
        element.addEventListener('change', function (event) {
            trackEvent('change', { target: event.target.tagName, id: event.target.id, value: event.target.value });
        });
        // Add more event types as needed (e.g., mouseover, submit, etc.)
    });
});

// Add event listeners
document.getElementById('changeExperienceButton').addEventListener('click', changeExperience);
document.getElementById('createExperimentForm').addEventListener('submit', submitExperiment);
document.getElementById('toggleButton').addEventListener('click', toggleExperience);
