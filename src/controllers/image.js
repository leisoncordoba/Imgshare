const path = require('path');
const { randomNumber } = require('../helpers/libs')
const fs = require('fs-extra');
const md5 = require('md5');

const { Image, Comment } = require('../models')
const sidebar = require('../helpers/sidebar')

const ctrl = {};

ctrl.index = async (req, res) => {
   let viewModel = {image: {}, comments: {}};

    const image = await Image.findById(req.params.image_id).sort({timestamp: -1}).lean()
    if (image) { 
        viewModel.image = image;
     
     
        const comments = await Comment.find({ image_id: image._id }).lean()
        viewModel.comments = comments;
        viewModel = await sidebar(viewModel)
        console.log(viewModel)
        
        res.render('image', viewModel );
    } else {
        res.redirect('/')
    }

};

ctrl.create = (req, res) => {

    const saveImage = async () => {

        const imgUrl = randomNumber();
        const images = await Image.find({ filename: imgUrl });
        const imageId = await Image.find({ title: req.body.title })
       
        if (images.length > 0) {
            saveImage();
        }

        const imageTempPath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`)

        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
            await fs.rename(imageTempPath, targetPath);
            const newImg = new Image({
                
                title: req.body.title,
                filename: imgUrl + ext,
                description: req.body.description
            })
            const imageSave = await newImg.save();

            console.log()

           res.redirect('/images/'+newImg.id )


        } else {
            await fs.unlink(imageTempPath);
            res.status(500).json({ error: 'Only Images are allowed' });
        }

    };

    saveImage();




};
ctrl.like = async (req, res) => {
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } })
    if (image) {



        image.like = image.like + 1;
        await image.save()
        res.json({ likes: image.like })
    } else {
        res.status(500).json({ error: 'internal Error' })
    }

}

ctrl.comment = async (req, res) => {
    const image = await Image.findById(req.params.image_id).lean()
    if (image) {
        const NewComent = new Comment(req.body);
        NewComent.gravatar = md5(NewComent.email);
        NewComent.image_id = image._id;
        await NewComent.save();
        res.redirect('/images/' + image._id)
    } else {
        res.redirect('/');
    }


}

ctrl.remove = async (req, res) => {
    const image = await Image.findById(req.params.image_id)

    
    
    await fs.unlink(path.resolve('./src/public/upload/'+ image.filename))
    
    await Comment.deleteOne({image_id: image._id});
    image.remove()
       
    
        res.json(true)
      



};

module.exports = ctrl;