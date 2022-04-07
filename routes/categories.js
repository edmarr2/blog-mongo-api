const router = require('express').Router()
const Category = require('../models/Category')
// Store
router.post('/', async (req, res) => {
    const newCategory = new Category({name: req.body.name})
    try {
        const category = await newCategory.save()
        res.status(200).json(category)
    }catch (err) {
        res.status(500).json(err)
    }
})

// Update
router.put('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    try {
        const updateCategory = await Category.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updateCategory)
    }catch (err) {
        res.status(500).json(err)
    }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id)
        res.status(200).json('Post deletado')
    }catch (err) {
        res.status(404).json('Usuário não encontrado')
    }
})

// List User
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        res.status(200).json(category)
    }catch (err) {
        res.status(404).json(err)
    }
})

// List User
router.get('/', async (req, res) => {
    const name = req.body.name
    try {
        let categories
        if(name) {
            categories = await Category.find({name})
        } else {
            categories = await Category.find()
        }
        res.status(200).json(categories)
    }catch (err) {
        res.status(404).json(err)
    }
})

module.exports = router