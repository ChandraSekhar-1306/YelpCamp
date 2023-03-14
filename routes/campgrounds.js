const express = require('express')
const catchAsync = require('../utils/catchAsync')
const Camp = require('../controllers/campgrounds')
const validateCampground = require('../utils/validateCampground')
const { isLoggedIn, isAuthor } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')

const upload = multer({ storage })
const router = express.Router()


// router.route('/') groups similiar routes no matter the type of http request sent...  in here , it groups all the '/' routes



router.route('/')
    .get(catchAsync(Camp.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(Camp.createCampground))

router.get('/new', isLoggedIn, Camp.renderNewForm)

router.get('/messageus', Camp.messageus)







router.route('/:id')
    .get(catchAsync(Camp.getCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(Camp.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(Camp.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(Camp.renderEditForm))





module.exports = router