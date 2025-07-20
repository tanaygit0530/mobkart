const mongoose = require('mongoose');
const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
})
const lapSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  processorbrand: {
    type: String,
    required: true
  },
  processortier: {
    type: String,
    required: true
  },
  rammemmory: {
    type: String,
    required: true
  },
  primarystoragetype: {
    type: String,
    required: true
  },
  storagecapacity: {
    type: Number,
    required: true
  },
  gpubrand: {
    type: String,
    required: true
  },
  istouchscreen: {
    type: Boolean,
    required: true
  },
  displaysize: {
    type: Number,
    required: true
  },
  resolutionwidth: {
    type: Number,
    required: true
  },
  resolutionheight: {
    type: Number,
    required: true
  },
  os: {
    type: String,
    required: true
  },
  warranty: {
    type: Number,
    required: true
  },
  images:[ImageSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
      }
    ]
})
module.exports = mongoose.model('Lap',lapSchema);