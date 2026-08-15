require("dotenv").config();

const express = require("express")
const path = require("path")
const axios = require("axios")

const app = express();

const API_BASE_URL = process.env.API_BASE_URL;

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static("public"))

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/posts`
        );

        res.render("index", {
            posts: response.data.posts
        });

    } catch (error) {
        res.status(500).send("could not load posts")
    }
})

app.get("/posts/:id", async (req, res) => {

    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/posts/${req.params.id}`
        );

        const commentsResponse = await axios.get(
            `${API_BASE_URL}/api/posts/${req.params.id}/comments`
        );

        res.render("post", {
            post: response.data,
            comments: commentsResponse.data.comments
        });

    } catch (error) {
        res.status(404).send("Post not found")
    }

})

app.post("/posts/:id/comments", async (req, res) => {
    try {
        await axios.post(
            `${API_BASE_URL}/api/posts/${req.params.id}/comments`,
            {
                username: req.body.username,
                content: req.body.content
            }
        );

        res.redirect(`/posts/${req.params.id}`);

    } catch (error) {
        res.status(400).send("Could not submit comment");
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Client running on port ${PORT}`)
});