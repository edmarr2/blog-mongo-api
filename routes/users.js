const router = require('express').Router()
const User = require('../models/User')
const Posts = require('../models/Posts')
const bcrypt = require('bcrypt')
// Update
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        if(req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true})
            res.status(200).json(updateUser)
        }catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(401).json('Você não tem autorização para realizar update')
    }

})

// Delete
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            try {
                await Posts.deleteMany({username: user.username})
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json('Usuário deletado')
            }catch (err) {
                res.status(500).json(err)
            }
        }catch (err) {
            res.status(404).json('Usuário não encontrado')
        }
    } else {
        res.status(401).json('Você não tem autorização para deletar')
    }
})

// List User
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc
        res.status(200).json(others)
    }catch (err) {
        res.status(404).json(err)
    }
})

module.exports = router