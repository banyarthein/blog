const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

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

app.post('/posts/', (request, response) => {
    const id = randomBytes(3).toString('hex');
    const { title } = request.body;

    posts[id] = {
        id,
        title
    };
    response.status(201).send(posts[id]);
    console.log('Post has created.');
});

app.listen(4000, () => {
    console.log('Server has started on port 4000.')
});