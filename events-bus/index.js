const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (request, response) => {
    const event = request.body;

    events.push(event);

    axios.post('http://post-cluster-service:4000/events', event);      //Post Service
    axios.post('http://comments-service/events', event);      //Comment Service
    axios.post('http://query-service:4002/events', event);      //Query Service
    axios.post('http://moderation-service:4003/events', event);      //Moderation Service

    response.send({ status: 'OK' });

});

app.get("/events", (request, response) => {
    response.send(events);
});

app.listen(4005, () => {
    console.log('Event Bus is Listening on 4005. (k)');
});