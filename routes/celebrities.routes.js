// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

const Celebrity = require('../models/Celebrity.model.js');

// GET route to create a celebrity
router.get('/celebrities/create', (req, res) => {
    res.render('celebrities/new-celebrity.hbs');
});

// POST route to save a new celebrity to the database
router.post('/celebrities/create', (req, res, next) => {
    const { name, occupation, catchPhrase } = req.body;
    Celebrity.create({ name, occupation, catchPhrase })
        .then(() => res.redirect('/celebrities'))
        .catch(() => res.render('celebrities/new-celebrity.hbs'));
});

// GET route to retrieve and display all the celebrities
router.get('/celebrities', (req, res, next) => {
    Celebrity.find()
      .then(allTheCelebritiesFromDB => {
        console.log('Retrieved celebrities from DB:', allTheCelebritiesFromDB);
        res.render('celebrities/celebrities.hbs', { celebrities: allTheCelebritiesFromDB });
      })
      .catch(error => {
        console.log('Error while getting the celebrities from the DB: ', error);
        // Call the error-middleware to display the error page to the user
        next(error);
      });
  });

module.exports = router;