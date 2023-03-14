
const campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const geoCode = require('../utils/geoCode')


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}
//-----------------------

module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({})

    res.render('campgrounds/index', { campgrounds })

}
//----------------------------

module.exports.createCampground = async (req, res, next) => {

    const newcampground = new campground(req.body.campground)
    newcampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))

    newcampground.author = req.user._id
    const data = await geoCode.forwardGeoCode(newcampground.location)
    if (data === null) {
        req.flash('Sorry an unexpected error occured ! Try creating the campground sometime later..  :(')
        return res.redirect('/campgrounds')
    }
    const arrayOfCoordinates = geoCode.convertToArray(data.addresses[0].latitude, data.addresses[0].longitude)
    newcampground.coordinates = arrayOfCoordinates
    await newcampground.save()

    //console.log(arrayOfCoordinates)




    req.flash('success', 'Successfully made a new Campground !')

    res.redirect(`/campgrounds/${newcampground._id}`)

}
//--------------------------

module.exports.getCampground = async (req, res) => {
    const { id } = req.params
    const camp = await campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')

    if (!camp) {
        req.flash('error', 'Cannot find that campground  :(')
        res.redirect('/campgrounds')
    }

    res.render('campgrounds/show', { camp })

}
//----------------------------------

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const camp = await campground.findById(id)
    res.render('campgrounds/edit', { camp })
}

//--------------------------------

module.exports.editCampground = async (req, res) => {
    const { id } = req.params


    const updatedCampground = await campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    updatedCampground.images.push(...imgs)
    await updatedCampground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await updatedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })

    }
    req.flash('success', 'Successfully updated your campground !')
    res.redirect(`/campgrounds/${updatedCampground.id}`)
}

//------------------------

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await campground.findByIdAndDelete(id)
    req.flash('success', 'Campground deleted successfully !')
    res.redirect('/campgrounds')

}

//---------------------------------------

module.exports.messageus = (req, res) => {
    res.render('campgrounds/messageus')
}