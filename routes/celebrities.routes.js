const router = require("express").Router();
const {loggedIn, isLoggedOut} = require("../config/guard")
const Celebrity = require('../models/Celebrity.model.js');

// GET route to create a celebrity
router.get('/celebrities/create', loggedIn, (req, res) => {
    res.render('celebrities/new-celebrity.hbs', {userSessionActive: req.session.currentUser});
});

// POST route to save a new celebrity to the database
router.post('/celebrities/create', loggedIn, (req, res, next) => {
    const { name, occupation, catchPhrase } = req.body;
    Celebrity.create({ name, occupation, catchPhrase })
        .then(() => res.redirect('/celebrities'))
        .catch(() => res.render('celebrities/new-celebrity.hbs'));
});

// GET route to update a specific celebrity
router.get('/celebrities/:id/edit', loggedIn, (req, res, next) => {
  const { id } = req.params;
 
  Celebrity.findById(id)
    .then(celebrityToEdit => {
      res.render("celebrities/edit-celebrity.hbs", {celebrityToEdit, userSessionActive: req.session.currentUser});
    });
});

// POST route to update a specific celebrity
router.post('/celebrities/:id/edit', loggedIn, (req, res, next) => {
  const { id } = req.params;
  const { name, occupation, catchPhrase } = req.body;
 
  Celebrity.findByIdAndUpdate(id, { name, occupation, catchPhrase }, { new: true })
    .then(updatedCelebrity => res.redirect(`/celebrities/${updatedCelebrity.id}`))
    .catch(error => next(error));
});

// POST route to delete a celebrity from the database
router.post('/celebrities/:id/delete', loggedIn, (req, res, next) => {
  const { id } = req.params;
 
  Celebrity.findByIdAndRemove(id)
    .then(() => res.redirect('/celebrities'))
    .catch(error => next(error));
});


// GET route to retrieve and display all the celebrities
router.get('/celebrities', (req, res, next) => {
    Celebrity.find()
      .then(allTheCelebritiesFromDB => {
        console.log('Retrieved celebrities from DB:', allTheCelebritiesFromDB);
        res.render('celebrities/celebrities.hbs', { celebrities: allTheCelebritiesFromDB, userSessionActive: req.session.currentUser });
      })
      .catch(error => {
        console.log('Error while getting the celebrities from the DB: ', error);
        // Call the error-middleware to display the error page to the user
        next(error);
      });
  });

// GET route for displaying the celebrity details page
router.get('/celebrities/:id', loggedIn, (req, res, next) => {
  const { id } = req.params;
 
  Celebrity.findById(id)
    .then(foundCeleb => res.render('celebrities/celebrity-details.hbs', foundCeleb, {userSessionActive: req.session.currentUser}))
    .catch(err => {
      console.log(`Error while getting a single celebrity from the  DB: ${err}`);
      next(err);
    });
});

module.exports = router;