const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8280;

// Add your API key here
const apiKey = process.env.API_KEY;

// Define the endpoint URL
const endpoint = 'https://routingnumbanklookup.herokuapp.com/abex/api/v1/';
// Define the request headers with the API key
const headers = {
    'x-api-key': apiKey
};


// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to dynamically add userId to headers if it exists in the request body
const addUserIdToHeaders = (req, res, next) => {
    // Check if userId exists in the request query or request body
    if(req.query.userId){
        headers['uuid'] = req.query.userId;
    }
    if (req.body) {
        headers['uuid'] = req.body.userId;
    }
    next();
};

app.use(addUserIdToHeaders);

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

    try {
        const response = await axios.get(endpoint+`status/?experimentName=${req.query.experimentName}&experimentId=${req.query.experimentId}`, { headers });

        if (response.data.status === 'fail') {
            // If the API response indicates failure, send the error message
            res.status(response.status).send(response.data.message);
        } else {
            // If the API response indicates success, send the experiment status data
            res.send(response.data);
        }
    } catch (error) {
        //console.error('Error fetching experiment status:', error);
        res.status(500).send('Internal Server Error');
    }

});

app.get('/data', (req, res) => {

    let experimentName = '';
    let experimentId = '';

    if (req.query.experimentName && req.query.experimentId) {
        experimentName = req.query.experimentName;
        experimentId = req.query.experimentId;
    } else {
        console.log('No experimentName or experimentId provided in query parameters. Loading default banner experiment.');
    }
    res.sendFile(path.join(__dirname, 'public', 'data.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'events.html'));
});

app.get('/mockTest', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mockTest.html'));
});

app.post('/start',async(req,res)=>{

    /*body = {
        "experimentName": "banner_exp_01",//required - saved experiment name
        "experimentId": 98761121, //required - saved experiment Id
        "durationDays": 30, //optional - default 14
        "sampleSize": 1000, //optional
        "trafficRate": 100 //optional 0 - 100
    };*/

    const response = await axios.post(endpoint+'start', req.body, { headers });
    res.send(response.data);

});

app.post('/restart',async(req,res)=>{

    /*body = {
        "experimentName": "MyFirstExperiment",
        "experimentId": 17945202,
        "durationDays": 30, //optional - default 14
        "sampleSize": 1000, //optional
        "trafficRate": 100 //optional 0 - 100
    }*/

    const response = await axios.post(endpoint+'restart', req.body, { headers });
    res.send(response.data);

});

app.post('/stop',async(req,res)=>{

    /*body = {
        "experimentName": "MyFirstExperiment",
        "experimentId": 17945202
    }*/

    const response = await axios.post(endpoint+'stop', req.body, { headers });
    res.send(response.data);

});

app.post('/decision',async(req,res)=>{

    /*body = {
        "experimentName": "MyFirstExperiment",
        "experimentId": 17945202,
        "decision": "B"
    }*/

    const response = await axios.post(endpoint+'decision', req.body, { headers });
    res.send(response.data);

});

app.post('/create',async(req,res)=>{

    try {
        // Make the HTTP request
        const response = await axios.post(endpoint+'create', req.body, { headers });

        //Make sure to save experimentName and experimentId so you can access your experiment later

        res.send(response.data);

    } catch (error) {
        // Handle errors
        if (error.response && error.response.status === 422) {
            // Extract error message for 422 Unprocessable Entity status code
            const errorMessage = error.response.data.message;
            res.status(422).send({ status: 'fail', message: errorMessage });
        } else {
            // For other errors, send a generic error message
            console.error('Error calling API:', error);
            res.status(500).send({ status: 'fail', message: 'Internal Server Error' });
        }
    }
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
