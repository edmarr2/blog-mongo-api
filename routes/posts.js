const router = require('express').Router()
const User = require('../models/User')
const Posts = require('../models/Posts')

// Store
router.post('/', async (req, res) => {
        try {
            const user = await User.findOne({username: req.body.username})
            !user && res.status(400).json('Não encontrado esse usuário')

            const newPost = new Posts({
                title: req.body.title,
                description: req.body.description,
                photo: req.body.photo,
                username: req.body.username,
                categories: req.body.categories
            })

            const post = await newPost.save()
            res.status(200).json(post)
        }catch (err) {
            res.status(500).json(err)
        }
})

// Update
router.put('/:id', async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)
            try {
                if (post.username === req.body.username) {
                    const updatePost = await Posts.findByIdAndUpdate(req.params.id, {
                        $set: req.body
                    }, {new: true})
                    res.status(200).json(updatePost)
                } else {
                    res.status(401).json('Você não tem autorização para realizar update')
                }
            }catch (err) {
                res.status(404).json('Post não encontrado')
            }
        }catch (err) {
            res.status(500).json(err)
        }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (post.username === req.body.username) {
            try {
                await Posts.findByIdAndDelete(req.params.id)
                res.status(200).json('Post deletado')
            }catch (err) {
                res.status(500).json(err)
            }
        } else {
            res.status(401).json('Você não tem autorização para deletar')
        }
    }catch (err) {
        res.status(404).json('Usuário não encontrado')
    }
})

// List User
router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        res.status(200).json(post)
    }catch (err) {
        res.status(404).json(err)
    }
})

// List User
router.get('/', async (req, res) => {
    const username = req.body.username
    const category = req.body.categories
    try {
        let posts
        if(username) {
            posts = await Posts.find({username})
        } else if (category) {
            posts = await Posts.find({categories: {$in: [category]}})
        } else {
            posts = await Posts.find()
        }
        res.status(200).json(posts)
    }catch (err) {
        res.status(404).json(err)
    }
})

module.exports = router