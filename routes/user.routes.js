const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const {loggedIn, isLoggedOut} = require("../config/guard")

router.get('/create', isLoggedOut, async (req, res)=> {
    res.render('user/signup')
})

router.post('/create', isLoggedOut, async (req, res) => {
    const user = new User({...req.body})
    const hash = await bcrypt.hash(req.body.password, 10)
    user.password = hash
    try {
        user.save()
        res.render('/', {userSessionActive: req.session.currentUser})
    } catch (err) {
        res.redirect('user/create')
    }
})

router.get('/login', isLoggedOut, (req, res) => {
    res.render('user/login')
})

router.post('/login', isLoggedOut, async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(user) {
        if(bcrypt.compare(user.password, req.body.password)) {
            req.session.currentUser = user
            res.render('user/profile', {userSessionActive: req.session.currentUser})
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})

router.get('/profile', loggedIn, async (req, res) => {
    const user = req.session.currentUser
    res.render('user/profile', {userSessionActive: req.session.currentUser})
})

router.get('/logout', loggedIn, (req, res) => {
    req.session.destroy()
    res.redirect('/login')
  })

module.exports = router