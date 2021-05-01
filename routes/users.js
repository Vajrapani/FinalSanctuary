const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const animal = require('../models/animal');
const request = require('../models/request');
const { forwardAuthenticated } = require('../config/auth');
const { adminAuthenticated} = require('../config/auth');
//

//
// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Stafflogin Page
router.get('/stafflogin', adminAuthenticated, (req, res) => res.render('stafflogin'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

//User Home
router.post('/home', (req, res) => {
  const { name } = req.body;
  let newRequest = new request ({
    animalname : name,
    requestee : req.user.name,
    status : 'Pending'
  })
  newRequest.save()
  res.redirect('/home')
});

router.post('/staffAdd', (req, res) => {
  const { name, description, birthday } = req.body;
  let newAnimal = new animal ({
    name : name,
    description : description,
    birthday : birthday,
    availability: true
  })
  newAnimal.save()
  res.redirect('/staffAdd')
}); 

router.post('/staffPendingRequests', (req, res) => {
  const { username, animalname, action } = req.body;
  if(action == "approve"){
    request.findOneAndUpdate({requestee: username, animalname: animalname},{status : 'Approved'}, (error, data) => {
      if(error){
        console.log(error)
      }else{
        console.log(data)
        res.redirect('/staffPendingRequests')
      }
    })

    animal.findOneAndUpdate({name : animalname}, {availability: false, Owner : username}, (error, data) => {
      if(error){
        console.log(error)
      }else{
        console.log(data)
      }
    })
  }

  if(action == "deny"){
    request.findOneAndUpdate({requestee: username, animalname: animalname},{status : 'Denied'}, (error, data) => {
      if(error){
        console.log(error)
      }else{
        console.log(data)
        res.redirect('/staffPendingRequests')
      }
    })
  }
})



// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Staff Login
router.post('/stafflogin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/staffhome',
    failureRedirect: '/users/stafflogin',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports = router;
