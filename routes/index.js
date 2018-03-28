var express = require('express');
var router = express.Router();

var request = require('request-promise');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hi', function(req, res) {
  request({uri: 'http://taco-randomizer.herokuapp.com/random/', json: true})
    .then(function(response) {
      res.json({
        base_layer: response.base_layer.name,
        condiment: response.condiment.name,
        mixin: response.mixin.name,
        shell: response.shell.name
      })
    })
});

router.get('/auth/github',
  passport.authenticate('github'));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect(req.session.returnTo || '/');
  });

router.get('/login', function(request, response) {
  response.send('This is the login page');
});

// router.post('/login', passport.authenticate('github', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

router.get('/repos',
  require('connect-ensure-login').ensureLoggedIn('/auth/github'),
  function(req, res) {
    request.get({
      uri: 'https://api.github.com/user/repos',
      headers: {
        'User-Agent': 'FSWD Demo'
      },
      auth: { bearer: req.user.access_token },
      json: true
    })
      .then(function(response) {
        console.log(response);
        res.json(response);
      })
  }
);

module.exports = router;
