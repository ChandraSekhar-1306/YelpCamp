const axios = require('axios')





module.exports.forwardGeoCode = async (address) => {

    const config = {
        params: { query: address },
        headers: {
            Authorization: process.env.RADAR_API_KEY,
        },
    };
    try {


        const response = await axios.get('https://api.radar.io/v1/geocode/forward', config)
        return response.data
    }
    catch (err) {
        return null
    }


}

module.exports.convertToArray = (...nums) => {
    return nums
}
