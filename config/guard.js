const session = require('express-session')

function loggedIn (req, res, next) {
  if (!req.session.currentUser) {
    return res.render('user/login')
  }
  next()
}

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/')
  }
  next()
}

module.exports = { loggedIn, isLoggedOut };