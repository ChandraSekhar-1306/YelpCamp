const campground = require('./models/campground')
const Review = require('./models/review')
module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in !')
        return res.redirect('/login')
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const camp = await campground.findById(id)
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permissions to do that..')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params
    const review = await Review.findById(reviewID)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permissions to do that..')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}