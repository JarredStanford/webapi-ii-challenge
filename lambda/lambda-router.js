const express = require('express')

const Lambda = require('../data/db.js')

const router = express.Router();

router.use(express.json());

//GET all posts
router.get('/', async (req, res) => {
    try {
        const lambda = await Lambda.find();
        res.status(200).json(lambda)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "The posts information could not be retrieved."
        })
    }
})

//GET specific post
router.get('/:id', async (req, res) => {
    try {
        const lambda = await Lambda.findById(req.params.id);

        if (lambda.length > 0) {
            res.status(200).json(lambda)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } catch (err) {
        res.status(500).json({
            message: "The post information could not be retrieved"
        })
    }
})

router.post("/", async (req, res) => {
    if (req.body.title && req.body.contents) {
        try {
            const lambda = await Lambda.insert(req.body);
            Lambda.findById(lambda.id).then(post => {
                res.status(200).json(post)
            })
        } catch (err) {
            res.status(500).json({
                message: "There was an error while saving the post to the database"
            })
        }
    } else {
        res.status(400).json({
            message: "Please provide title and contents for the post."
        })
    }
})

module.exports = router;