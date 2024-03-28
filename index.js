const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Define the API key
const apiKey = '6a8bd65056746d3aaa8d16ba6f0f3b8dec75899f678225020d2e51bd5baa800539b8737c86661cedd90ecf0a4b9a3ca3ddd08437dc53f444aeb82338dc83f649';

// Define the endpoint URL
const endpoint = 'https://routingnumbanklookup.herokuapp.com/abex/api/v1/';
// Define the request headers with the API key
const headers = {
    'x-api-key': apiKey
};

// Serve static files from the "public" directory
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post('/allocation', async (req, res) => {
    const data = {
        "experimentName": "banner_exp_01",
        "experimentId": 98761121,
        "userId": req.body.userId
    };
    try {
        const response = await axios.post(endpoint + 'allocation', data, { headers });
        res.send(response.data);
    } catch (error) {
        console.error('Error calling allocate API:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.get('/status', async(req,res)=>{

    // Define the payload
    const data = {
        "experimentName": "banner_exp_01",//required - saved experiment name
        "experimentId": 98761121, //required - saved experiment Id
    };

    const response = await axios.get(endpoint+`status/?experimentName=${data.experimentName}&experimentId=${data.experimentId}`, { headers });

    res.send(response.data);

});

app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'data.html'));
});

app.get('/start',async(req,res)=>{

    // Define the payload
    const data = {
        "experimentName": "banner_exp_01",//required - saved experiment name
        "experimentId": 98761121, //required - saved experiment Id
        //"durationDays": 30, //optional - defauly 14
        //"sampleSize": 1000, //optional 
        //"trafficRate": 100 //optional 0 - 100
    };

    const response = await axios.post(endpoint+'start', data, { headers });

    res.send(response.data);

});

app.get('/create',async(req,res)=>{

    // Define the payload
    const data = {
        experimentName: 'banner_exp_01'
    };

    try {
        // Make the HTTP request
        const response = await axios.post(endpoint+'create', data, { headers });

        //Make sure to save experimentName and experimentId so you can access your experiment later

        // Assert that the response is successful
        res.send(response.data);

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