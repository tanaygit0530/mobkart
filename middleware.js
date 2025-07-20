const express = require('express');
const Mob = require('./models/mobile')
const Lap = require('./models/laptop');
const Review = require('./models/review');
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const mobile = await Mob.findById(id);
  // Make sure author exists
  if (!mobile.author || !mobile.author.equals(req.user._id)) {
    req.flash('error', 'Permission Not Granted!!');
    return res.redirect(`/mobkart/mobile/${id}`);
  }

  next();
};

module.exports.isLaptopAuthor = async (req, res, next) => {
  const { id } = req.params;
  const laptop = await Lap.findById(id);
  if (!laptop || !laptop.author.equals(req.user._id)) {
    req.flash('error', 'Permission Not Granted!!');
    return res.redirect(`/mobkart/laptop/${id}`);
  }
  next();
};

module.exports.isLoggedIn = ((req,res,next) => {
  if(!req.isAuthenticated()){
    req.flash('error','You must Logged In!!');
    return res.redirect('/mobkart/login');
  }
  next();
});
module.exports.wrapAsync = (fn) => {
  return function(req,res,next){
    fn(req,res,next).catch(e => next(e))
  }
}
module.exports.isReviewAuthor = async(req,res,next) => {
  const {id,reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author ||!review.author.equals(req.user._id)){
    req.flash('error','You do not have Permission!!');
    return res.redirect(`/mobkart/mobile/${id}`)
  }
  next();
}