const express = require('express')
const campground = require('../models/campground')
const Review = require('../models/review')
const reviews = require('../controllers/reviews')
const validateReview = require('../utils/validateReview')
const { isLoggedIn, isReviewAuthor } = require('../middleware')
const catchAsync = require('../utils/catchAsync')

const router = express.Router()

router.post('/:id/reviews', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:id/reviews/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router