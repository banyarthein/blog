const express = require('express');
const { randomByes } = require('crypto');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json);

app.get('/posts/:id/comments', (request, response) => {
    console.log('comments are requested');
});

app.post('/posts/:id/comments', (request, response) => {
    console.log('new comment added.');
});


app.listen(4001, () => {
    console.log('Comment Service has started on 4001')
});
