const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: Axios } = require('axios');

//const { request, response } = require('express');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const posts = {};

/*
from client
    Post 
    {
        id = '3241',
        title='this it test'
    }

*/

app.get('/posts', (request, response) => {
    response.send(posts);
    console.log('Getting posts')
});

app.post('/posts/', async (request, response) => {
    const id = randomBytes(4).toString('hex');
    const { title } = request.body;

    posts[id] = {
        id,
        title
    };

    await Axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id,
            title
        }
    });


    response.status(201).send(posts[id]);
    console.log('Post has created.');
});


app.post("/events", (request, response) => {
    console.log("(Post) Received Events ", request.body.type);
    response.send({});
});


app.listen(4000, () => {
    console.log('Server has started on port 4000.')
});