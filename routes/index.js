var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Home' });
});

/* GET team page. */
router.get('/team', function(req, res) {
    res.render('team', { title: 'Team' });
});

/* GET contact page. */
router.get('/contact', function(req, res) {
  res.render('contact', { title : 'Contact' });
});

module.exports = router;
