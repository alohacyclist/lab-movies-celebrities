const router = require("express").Router();
const {loggedIn, isLoggedOut} = require("../config/guard")
const Movie = require('../models/Movie.model');
const Celebrity = require('../models/Celebrity.model');

// GET route to create a movie
router.get('/movies/create', loggedIn, (req, res) => {
    Celebrity.find()
    .then((dbCelebrities) => {
        res.render('movies/new-movie.hbs', {dbCelebrities, userSessionActive: req.session.currentUser});
    });
});

// POST route to save a new movie to the database
router.post('/movies/create', loggedIn, (req, res, next) => {
    const { title, genre, plot, cast } = req.body;
    Movie.create({ title, genre, plot, cast })
        .then(() => res.redirect('/movies'))
        .catch(() => res.render('movies/new-movie.hbs'));
});

// GET route to update a specific movie
router.get('/movies/:id/edit', loggedIn, (req, res, next) => {
  const { id } = req.params;
  let movie;
 
  Movie.findById(id)
    .then(movieToEdit => {
      movie = movieToEdit;
    })
    .then(() => {
      Celebrity.find()
        .then(celebrities => {
          res.render("movies/edit-movie.hbs", {movie, celebrities, userSessionActive: req.session.currentUser});
        });
    });
});

// POST route to update a specific movie
router.post('/movies/:id/edit', loggedIn, (req, res, next) => {
  const { id } = req.params;
  const { title, genre, plot, cast } = req.body;
 
  Movie.findByIdAndUpdate(id, { title, genre, plot, cast }, { new: true })
    .then(updatedMovie => res.redirect(`/movies/${updatedMovie.id}`, {userSessionActive: req.session.currentUser}))
    .catch(error => next(error));
});

// POST route to delete a movie from the database
router.post('/movies/:id/delete', loggedIn, (req, res, next) => {
  const { id } = req.params;
 
  Movie.findByIdAndRemove(id)
    .then(() => res.redirect('/movies'))
    .catch(error => next(error));
});

// GET route to retrieve and display all the movies
router.get('/movies', (req, res, next) => {
    Movie.find()
      .then(allTheMoviesFromDB => {
        res.render('movies/movies.hbs', { movies: allTheMoviesFromDB, userSessionActive: req.session.currentUser });
      })
      .catch(error => {
        console.log('Error while getting the movies from the DB: ', error);
        next(error);
      });
  });

// GET route for displaying the movie details page
router.get('/movies/:id', loggedIn, (req, res, next) => {
  const { id } = req.params;
 
  Movie.findById(id)
    .populate('cast')
    .then(foundMovie => res.render('movies/movie-details.hbs', {foundMovie, userSessionActive: req.session.currentUser}))
    .catch(err => {
      console.log(`Error while getting a single movie from the  DB: ${err}`);
      next(err);
    });
});

module.exports = router;