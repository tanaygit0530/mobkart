const express = require('express');
const router = express.Router({mergeParams: true});
const Mob = require('../models/mobile');
const Lap = require('../models/laptop');
const Review = require('../models/review');
const { isReviewAuthor,isLoggedIn } = require('../middleware');

router.post('/mobkart/mobile/:id/reviews',isLoggedIn,async(req,res) => {
  const {id} = req.params;
  const mobile = await Mob.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  mobile.reviews.push(review);
  await review.save();
  await mobile.save();
  req.flash('success','Thanks For the Review!!!');
  res.redirect(`/mobkart/mobile/${mobile._id}`);

})
router.delete('/mobkart/mobile/:id/reviews/:reviewId', isReviewAuthor, async(req,res) => {
  const {id,reviewId} = req.params;
  await Mob.findByIdAndUpdate(id,{$pull: {review: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success','Review Deleted!!!');
  res.redirect(`/mobkart/mobile/${id}`);

})

router.post('/mobkart/laptop/:id/reviews',isLoggedIn,async(req,res) => {
  const {id} = req.params;
  const laptop = await Lap.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  laptop.reviews.push(review);
  await review.save();
  await laptop.save();
  req.flash('success','Thanks For the Review!!!');
  res.redirect(`/mobkart/laptop/${laptop._id}`);

})
router.delete('/mobkart/laptop/:id/reviews/:reviewId', isReviewAuthor, async(req,res) => {
  const {id,reviewId} = req.params;
  await Lap.findByIdAndUpdate(id,{$pull: {review: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success','Review Deleted!!!');
  res.redirect(`/mobkart/laptop/${id}`);

})
module.exports = router;
