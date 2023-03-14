
const cities = require('./cities')
const campground = require('../models/campground')
const { descriptors, places } = require('./seedHelpers')
const mongoose = require('mongoose')

mongoose.connect('mongodb://0.0.0.0:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => {
        console.log("Mongo Connection open")
    })
    .catch(err => {
        console.log("Error")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDb = async () => {
    await campground.deleteMany({})
    for (let i = 0; i < 40; i++) {
        const randNum = Math.floor(Math.random() * 40)
        const rand1 = Math.floor(Math.random() * 18)
        const camp = new campground({
            author: '63fce0a0b73fdea7a630e229',
            location: `${cities[randNum].city} , ${cities[randNum].state}`,
            title: `${descriptors[rand1]} ${places[rand1]}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/duefzmqm1/image/upload/v1678504279/YelpCamp/lbdhcdwnanikynvq6kab.jpg',
                    filename: 'YelpCamp/lbdhcdwnanikynvq6kab',

                },
                {
                    url: 'https://res.cloudinary.com/duefzmqm1/image/upload/v1678371063/YelpCamp/fdfvb1lo9xpeepine3mt.jpg',
                    filename: 'YelpCamp/fdfvb1lo9xpeepine3mt',

                },
                {
                    url: 'https://res.cloudinary.com/duefzmqm1/image/upload/v1678208494/YelpCamp/kpo76a6oq2d3zyxwxv2p.jpg',
                    filename: 'YelpCamp/kpo76a6oq2d3zyxwxv2p'
                }
            ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel facere eos nihil eius maxime sint aperiam quasi dolore, numquam id nostrum ut exercitationem cupiditate in dolorem. Rem sit asperiores quas.',
            price: rand1,
            coordinates: [27.977611, -81.769611]
        })
        await camp.save()
    }
}
seedDb().then(() => {
    mongoose.connection.close()
})