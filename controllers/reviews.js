const Review = require('../models/review')
const campground = require('../models/campground')



module.exports.createReview = async (req, res) => {
    const camp = await campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    res.redirect(`/campgrounds/${camp._id}`)

}

//------------------------------------

module.exports.deleteReview = async (req, res) => {

    const { id, reviewID } = req.params


    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } }) // $pull deletes or removes an element from a list of elements.(array)
    // await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true }).populate("reviews")
    await Review.findByIdAndDelete(reviewID)
    res.redirect(`/campgrounds/${id}`)

}

//--------------------------------------
