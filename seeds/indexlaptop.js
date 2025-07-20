const mongoose = require('mongoose');
const laptopseed = require('./laptopseed');
const Lap = require('../models/laptop')
mongoose.connect('mongodb://127.0.0.1:27017/MobKartapp')
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((e) => {
  console.log("Cannot connected to MongoDB!!!!");
  console.log(e);
})
const seedDB = async () => {
  await Lap.deleteMany({});

  for(let i=0; i < laptopseed.length; i++){
  const lapData = laptopseed[i];
  const lapdet = new Lap({
    brand: lapData.brand,
    model: lapData.Model,
    price: lapData.Price,
    processortier: lapData.processor_tier,
    processorbrand: lapData.processor_brand,
    rammemmory: lapData.ram_memory,
    primarystoragetype: lapData.primary_storage_type,
    storagecapacity: lapData.primary_storage_capacity,
    gpubrand: lapData.gpu_brand,
    istouchscreen: lapData.is_touch_screen ? 1 : 0,
    displaysize: lapData.display_size,
    resolutionwidth: lapData.resolution_width,
    resolutionheight: lapData.resolution_height,
    os: lapData.OS,
  warranty: parseInt(lapData.year_of_warranty) || 1,
images: [
  {
    url: 'https://res.cloudinary.com/dopixi5x7/image/upload/v1752313801/MobKart/ul7l5elbwqkhnz4ttsio.jpg',
    filename: 'MobKart/ul7l5elbwqkhnz4ttsio'
  }
]

  })
  await lapdet.save();
  }
}
seedDB().then(() => {
  mongoose.connection.close();
})
