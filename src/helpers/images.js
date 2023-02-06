const {Image} = require('../models');

module.exports = {

   async popular(){
      const images = await Image.find().lean()
       .limit(5)
       .sort({like: -1})

       return images;
    }
}