const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to start the conversation
app.post('/conversation', async (req, res) => {
    try {
        console.log('in conversaion')
        // Receive conversation flow from the request body
        const conversationFlow = req.body;
        console.log(req.body);
        // Execute the conversation flow
        let currentPage = 0;
        let response;
        while (currentPage < conversationFlow.length) {
            // Get the current step of the conversation
            const currentStep = conversationFlow[currentPage];

            // Execute the step function
            response = await executeStep(currentStep);

            // If response indicates moving to the next page, increment currentPage
            if (response === 'next') {
                currentPage++;
            } else {
                // If response is a specific page number, set currentPage to that page
                currentPage = response;
            }
        }

        // Send the final response to the client
        res.json({ reply: response });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to execute a step of the conversation
async function executeStep(step) {
    // Convert the step string to a function
    const stepFunction = new Function('response', step);

    // Execute the step function
    const result = await stepFunction();

    // Return the result of the step execution
    return result;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

//Needed for jest tests
module.exports = app;