const { Comment, Image } = require('../models');

async function imageCounter() {
    return await Image.countDocuments();
}

async function commentCounter() {
    return await Comment.countDocuments();
}

async function likesTotalCounter() {
    const result = await Image.aggregate([{
        $group: {
            _id: '1',
            likesTotal: { $sum: '$like' }
        }
    }]);
    return result[0].likesTotal;
}

module.exports = async () => {
   const results = await Promise.all([
        imageCounter(),
        commentCounter(),
        likesTotalCounter()
    ])
    return{
        images: results[0],
        comments: results[1],
        likes: results[2]
    }


}