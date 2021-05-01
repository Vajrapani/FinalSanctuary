const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const animal = require('../models/animal');
const request = require('../models/request');
//
var mongoose = require("mongoose");
mongoose.connect('mongodb+srv://deep:pass1@cluster0.dgmlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
var connection = mongoose.connection;
//

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));
//

// home
router.get('/home', ensureAuthenticated, (req, res) => {
  animal.find({availability: true}, function(err, animals) {
    res.render('home', {
      user: req.user,
      animalList: animals
    })
  })

});

router.get('/staffAnimalList', ensureAuthenticated, (req, res) => {
  animal.find({}, function(err, animals) {
    res.render('staffAnimalList', {
      user: req.user,
      animalList: animals
    })
  })

});



// staff home
router.get('/staffhome', ensureAuthenticated, (req, res) =>
  res.render('staffhome', {
    user: req.user
  })
);

router.get('/userAdoptionPage', ensureAuthenticated, (req, res) =>
request.find({requestee : req.user.name}, function(err, requests) {
  res.render('userAdoptionPage', {
    user: req.user,
    requestList: requests
  })
})
);

router.get('/staffPendingRequests', ensureAuthenticated, (req, res) =>
request.find({status : 'Pending'}, function(err, requests) {
  res.render('staffPendingRequests', {
    user: req.user,
    requestList: requests
  })
})
);

router.get('/staffAllRequests', ensureAuthenticated, (req, res) =>
request.find({}, function(err, requests) {
  res.render('staffAllRequests', {
    user: req.user,
    requestList: requests
  })
})
);

router.get('/staffAdd', ensureAuthenticated, (req, res) =>
  res.render('staffAdd', {
    user: req.user
  })
);

module.exports = router;
