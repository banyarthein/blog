const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { request } = require('express');

const app = express();
app.use(bodyParser.json());

app.post("/events", async (request, response) => {
    const { type, data } = request.body;
    if (type === "CommentCreated") {
        const status = data.content.includes('orange') ? "rejected" : "approved";

        await axios.post("http://localhost:4005/events", {
            type: "CommentCreated",
            data: {
                id: data.id,
                postId: data.postId,
                status: status,
                conten: data.content,
            }

        });

        response.send({});

    }
});

app.listen(4003, () => {
    console.log("Listening at 4003 (Moderation service)");
});
