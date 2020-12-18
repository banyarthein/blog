const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const commentsByPostID = {};

app.get('/posts/:id/comments', (request, response) => {
    console.log('comments are requested');
    response.send(commentsByPostID[request.params.id] || []);
});

app.post('/posts/:id/comments', (request, response) => {
    console.log('new comment added.');
    const commentId = randomBytes(4).toString('hex');
    const { title, content } = request.body;

    const comments = commentsByPostID[request.params.id] || [];
    comments.push({ id: commentId, content, title });

    commentsByPostID[request.params.id] = comments;

    response.status(201).send(comments);

});


app.listen(4001, () => {
    console.log('Comment Service has started on 4001');
});
