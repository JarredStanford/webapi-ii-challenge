const express = require('express');

const lambdaData = require("./lambda/lambda-router.js")

const server = express();

server.get("/", (req, res) => {
    res.send(`
    Welcome to the Lambda Api`)
})

server.use('/api/posts', lambdaData);

server.listen(5000, () => {
    console.log("Server up and running!")
})