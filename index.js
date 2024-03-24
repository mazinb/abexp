const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(__dirname));

// Middleware to parse JSON bodies
app.use(bodyParser.json());
/*
app.get('/',async(req,res)=>{

    console.log('in get request');

    const stepString = `async function step(response) {
        console.log('test step');
        const question = "Do you want to continue?";
        const options = ["Yes", "No"];
        console.log(question);
        return { question, options };
    }`;

    res.send(eval(stepString+'step(res);'));

});*/

app.get('/create',async(req,res)=>{

    // Define the API key
    const apiKey = '6a8bd65056746d3aaa8d16ba6f0f3b8dec75899f678225020d2e51bd5baa800539b8737c86661cedd90ecf0a4b9a3ca3ddd08437dc53f444aeb82338dc83f649';

    // Define the endpoint URL
    const endpoint = 'https://routingnumbanklookup.herokuapp.com/abex/api/v1/';

    // Define the payload
    const data = {
        experimentName: 'test'
    };

    // Define the request headers with the API key
    const headers = {
        'x-api-key': apiKey
    };

    try {
        // Make the HTTP request
        const response = await axios.post(endpoint+'create', data, { headers });

        // Assert that the response is successful
        res.send(response.data);

        // Optionally, you can also assert other properties of the response
        // For example:
        // expect(response.data).toBeDefined();
    } catch (error) {
        // Handle errors
        console.error('Error calling API:', error);
        throw error; // Re-throw the error to fail the test
    }
})
  
/*
// Endpoint to start the conversation approach 1
app.post('/conversation', async (req, res) => {
    try {
        // Receive conversation flow from the request body
        const conversationFlow = req.body;
        // Execute the conversation flow
        let currentPage = 0;
        let response;
        while (currentPage < conversationFlow.length) {
            // Get the current step of the conversation
            const currentStep = conversationFlow[currentPage];

            console.log('in loop with: '+currentStep);

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
    console.log('in step');

    try {
        // Execute the step function
        //const result = await eval(`(async function(response) { ${step} })()`);
        const result = await eval(step);

        console.log(result);

        // Return the result of the step execution
        return result;
    } catch (error) {
        console.error('Error in step execution:', error);
        throw { error: 'Internal server error', details: error.message }; // Throw a custom error object
    }
}

//end of approach 1

//start of approach 2

// Endpoint to start the conversation
app.post('/conversation2', async (req, res) => {
    try {
      // Receive conversation flow from the request body
      const conversationFlow = req.body;
  
      // Execute the conversation flow
      let currentNodeIndex = 0;
      let currentStep;
      let response;
  
      while (currentNodeIndex < conversationFlow.length) {
        currentStep = conversationFlow[currentNodeIndex];
  
        if (currentStep.question) {
          response = await askQuestion(currentStep.question, currentStep.options);
          currentNodeIndex = handleResponse(response);
        } else if (currentStep.answer) {
          // End of conversation
          return res.json({ reply: currentStep.answer });
        }
      }
  
      // If the end of the flow is reached without a valid response
      throw new Error('Invalid conversation flow');
    } catch (error) {
      console.error('Error in conversation execution:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Function to ask a question and provide options
  function askQuestion(question, options) {
    // Simulate asking the question and providing options
    console.log(question);
    console.log("Options:");
    options.forEach((option, index) => console.log(`${index + 1}. ${option.text}`));
  
    // Simulate user selecting an option
    const selectedOption = 1; // Assume user selects the first option for now
    return options[selectedOption - 1];
  }
  
  // Function to handle user's response and determine the next step
  function handleResponse(response) {
    return response.next;
  }

//end of approach 2
*/
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

//Needed for jest tests
module.exports = app;