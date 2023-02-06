const ctrl = {};
const { Image } = require('../models')

const sidebar = require('../helpers/sidebar')

ctrl.index = async (req, res) => {
  const images = await Image.find().lean().sort({ timestamp: -1 });
  let viewModel = { images: [] };
  viewModel.images = images;
  viewModel = await sidebar(viewModel);
   console.log(viewModel.sidebar.comments[0]._id)
  res.render('index', viewModel)
}

module.exports = ctrl;