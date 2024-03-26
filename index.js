const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const { mockEndpointHandler } = require("./test_data/mock_endpoints");

const app = express();
const port = 3000;

// Define the API key
const apiKey = '6a8bd65056746d3aaa8d16ba6f0f3b8dec75899f678225020d2e51bd5baa800539b8737c86661cedd90ecf0a4b9a3ca3ddd08437dc53f444aeb82338dc83f649';

// Define the endpoint URL
const endpoint = 'https://routingnumbanklookup.herokuapp.com/abex/api/v1/';

// Serve static files from the "public" directory
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Mock endpoint route
app.get("/api/mock-endpoint", mockEndpointHandler);

app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'data.html'));
});

app.get('/create',async(req,res)=>{

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
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

//Needed for jest tests
module.exports = app;