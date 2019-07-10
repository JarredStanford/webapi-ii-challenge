const express = require('express')

const Posts = require('../data/db.js')

const router = express.Router();

router.use(express.json());

//GET all posts
router.get('/', async (req, res) => {
    try {
        const post = await Posts.find();
        res.status(200).json(post)
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
        const post = await Posts.findById(req.params.id);

        if (post.length > 0) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } catch (err) {
        res.status(500).json({
            message: "The post information could not be retrieved"
        })
    }
})

//GET comments on a post
router.get('/:id/comments', async (req, res) => {
    try {
        const lambda = await Posts.findPostComments(req.params.id);

        if (lambda.length > 0) {
            res.status(200).json(lambda)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved."
        })
    }
})

//POST a new post
router.post('/', async (req, res) => {
    if (req.body.title && req.body.contents) {
        try {
            const lambda = await Posts.insert(req.body);
            const lambdaID = await Posts.findById(lambda.id)
            res.status(200).json(lambdaID)
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

//POST a new comment
router.post('/:id/comments', async (req, res) => {
    const commentInfo = {
        post_id: req.params.id,
        text: req.body.text
    }
    if (req.body.text) {
        try {
            const lambda = await Posts.insertComment(commentInfo)
            const lambdaComment = await Posts.findCommentById(lambda.id)
            if (lambda) {
                res.status(200).json(lambdaComment)
            } else {
                res.status(404).json({
                    message: "The post could not be found"
                })
            }
        } catch (err) {
            res.status(500).json({
                message: "There was an error while saving the comment to the database"
            })
        }
    } else {
        res.status(400).json({
            message: "Please provide text for the comment."
        })
    }
})

//DELETE a post
router.delete('/:id', async (req, res) => {
    try {
        const lambda = await Posts.findById(req.params.id)
        const lambdaDelete = await Posts.remove(req.params.id)
        if (lambdaDelete > 0) {
            res.status(200).json(lambda)
        } else {
            res.status(404).json({
                message: "The post could not be found"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: 'Error removing the post'
        })
    }
})

//PUT update a post
router.put('/:id', async (req, res) => {
    if (req.body.title && req.body.contents) {
        try {
            const lambda = await Posts.update(req.params.id, req.body)
            const lambdaID = await Posts.findById(req.params.id)
            if (lambda) {
                res.status(200).json(lambdaID)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        } catch (err) {
            res.status(500).json({
                message: "The post information could not be modified."
            })
        }
    } else res.status(400).json({
        message: "Please provide title and contents for the post."
    })
})



module.exports = router;