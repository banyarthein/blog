const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (request, response) => {
    response.send(posts);
});

app.post('/events', (request, response) => {
    const { type, data } = request.body;

    if (type === "PostCreated") {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };

    }

    if (type === "CommentCreated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    console.log("All Posts", posts);

    response.send({});

});

app.listen(4002, () => {
    console.log("Query Service is Listening on 4002");
});