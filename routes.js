const express = require('express');
const router = express.Router();
const mainController = require('./controllers/mainController');
const path = require('path');
const projectData = require('./models/projectData');

const root = path.join(__dirname, "public")

router.get('/', (req, res) => {
    res.sendFile(
        "./index.html",
        {
            root,
        },
        // mainController.getData()
    );
});

router.get('/posts', (req, res) => {
    res.send(mainController.getPosts());
})

router.post('/posts', (req, res) => {
    mainController.addPost(req);
    res.send(mainController.getPosts());
});

module.exports = router;
