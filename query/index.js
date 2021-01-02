const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {

    if (type === "PostCreated") {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === "CommentCreated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if (type === "CommentModerated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(c => {
            return c.id === id;
        });

        comment.status = status;
        comment.content = content;
    }

}

app.get('/posts', (request, response) => {
    console.log("Reading from Query Service");
    response.send(posts);
});

app.post('/events', (request, response) => {

    const { type, data } = request.body;
    handleEvent(type, data);
    console.log("All Posts", posts);
    response.send({});

});

app.listen(4002, async () => {
    console.log("Query Service is Listening on 4002");
    const response = await axios.get('http://event-bus-service:4005/events');

    for (let event of response.data) {
        console.log("Processing events", event.type);
        handleEvent(event.type, event.data);
    }
});

