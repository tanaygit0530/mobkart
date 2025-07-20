const mongoose = require('mongoose');
const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
})
const mobSchema = new mongoose.Schema({
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
  has5g: {
    type: Boolean,
    required: true
  },
  hasNfc: {
    type: Boolean,
    required: true
  },
  hasIrBlaster: {
    type: Boolean,
    required: true
  },
  processorBrand: {
    type: String,
    required: true
  },
  numCores: {
    type: Number,
    required: true
  },
  processorSpeed: {
    type: Number,
    required: true
  },
  batteryCapacity: {
    type: Number,
    required: true
  },
  fastChargingAvailable: {
    type: Boolean,
    required: true
  },
  fastCharging: {
    type: Number,
    required: true
  },
  ramCapacity: {
    type: Number,
    required: true
  },
  internalMemory: {
    type: Number,
    required: true
  },
  screenSize: {
    type: Number,
    required: true
  },
  refreshRate: {
    type: Number,
    required: true
  },
  numRearCameras: {
    type: Number,
    required: true
  },
  numFrontCameras: {
    type: Number,
    required: true
  },
  os: {
    type: String,
    required: true
  },
  primaryCameraRear: {
    type: Number,
    required: true
  },
  primaryCameraFront: {
    type: Number,
    required: true
  },
  extendedMemoryAvailable: {
    type: Boolean,
    required: true
  },
  extendedUpto: {
    type: Number,
    required: true
  },
  images: [ImageSchema],
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
module.exports = mongoose.model('Mob',mobSchema);