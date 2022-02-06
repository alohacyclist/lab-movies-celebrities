const session = require("express-session")
const store = require("connect-mongo")

module.exports = app => {
    app.use(
        session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 300000,
        },
        store: store.create({
            mongoUrl: 'mongodb://localhost/lab-movies-celebrities'
        })
    }))
}