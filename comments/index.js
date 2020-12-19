const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: Axios } = require('axios');
const { request, response } = require('express');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const commentsByPostID = {};

app.get('/posts/:id/comments', (request, response) => {
    console.log('comments are requested');
    response.send(commentsByPostID[request.params.id] || []);
});

app.post('/posts/:id/comments', async (request, response) => {
    console.log('new comment added.');
    const commentId = randomBytes(4).toString('hex');
    const { title, content } = request.body;

    const comments = commentsByPostID[request.params.id] || [];
    comments.push({
        id: commentId,
        content,
        title,
        status: 'pending'
    });

    console.log("Post object", request.post);

    await Axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: request.params.id,
            status: 'pending'
        }
    });

    commentsByPostID[request.params.id] = comments;

    response.status(201).send(comments);

});

app.post("/events", async (request, response) => {
    console.log("(Comment) Received Events", request.body.type);
    const { type, data } = request.body;

    if (type === "CommentModerated") {
        const { postId, id, status } = data;
        const comments = commentsByPostID[postId];

        const comment = comments.find(c => {
            return c.id === id;
        })
        comment.status = status;

        await Axios.post("http://localhost:4005/events", {
            type: "CommentUpdated",
            data: {
                id,
                status,
                postId,
                content: comment.content
            }
        });
    }
    response.send({});
});

app.listen(4001, () => {
    console.log('Comment Service has started on 4001');
});
