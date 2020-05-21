const projectData = require('../models/projectData');
const apiUrl = process.env.WEATHER_URL;

exports.getData = async () => {
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

exports.getPosts = () => {
    return projectData.posts;
}

exports.addPost = (req, res) => {
    projectData.add(req.body);
    return projectData.posts;
}