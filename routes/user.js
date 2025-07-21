const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const flash = require('connect-flash');


router.get('/mobkart/register',(req,res) => {
  res.render('user/Register');
})
router.post('/mobkart/register',async(req,res) => {
  try{
  const {email,username,password} = req.body;
  const user = new User({email,username});
  const registeredUser = await User.register(user,password);
  req.login(registeredUser, (err) => {
  if (err) return next(err);
  req.flash('success', 'Welcome to MobKart!');
  res.redirect('/mobkart');
  
})
  }catch(e){
    console.log(e);
    req.flash('error',e.message);
    res.redirect('/mobkart/register')
  }
})
router.get('/mobkart/login',(req,res) => {
  res.render('user/login')
})
router.post('/mobkart/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/mobkart/login'}),(req,res) => {
  try{
  req.flash('success','Welcome Back!!!');
  res.redirect('/mobkart');
  }catch(e){
    console.log(e);
  }
})
router.get('/mobkart/logout',(req,res,next) => {
      req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/mobkart');
    });
})
// Start OAuth login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/mobkart/login', failureFlash: true }),
  (req, res) => {
    req.flash('success', 'Logged in with Google!');
    res.redirect('/mobkart');
  });



module.exports = router;
