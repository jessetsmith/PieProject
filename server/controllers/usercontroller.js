const router = require('express').Router();
const user = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//SIGNUP

router.post('/signup', (req, res) => {
    user.create({
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 13)
    })
    .then(
        createSuccess = (user) => {
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
            res.json({
                user: user,
                message: 'user created',
                sessionToken: token
            })
        }
    )
    .catch(err => res.send(500, err))
})

// SIGNIN

router.post('/signin', (req, res) => {
    user.findOne({ where: {email: req.body.user.email}})
    .then(user => {
        if(user){
            bcrypt.compare(req.body.user.password, user.password, (err, matches) => {
                if(matches){
                    let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
                        res.json({
                            user: user,
                            message: 'succesfully authenticated user',
                            sessionToken: token
                        })
                         } else {
                             res.status(502).send({error: 'bad gateway, passwords don\'t match'})
                         }
            })
        } else {
            res.status(500).send({error: 'failed to authenticate, no user found'})
        }
    }, err => res.status(501).send({error: 'failed to process'})
    )
})

module.exports = router; 