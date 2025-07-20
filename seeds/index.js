const Mob = require('../models/mobile')
const mobilesSeed = require('./mobilesSeed');
const User = require('../models/user')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/MobKartapp')
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((e) => {
  console.log("Cannot connected to MongoDB!!!!");
  console.log(e);
})
const seedDb = async () => {
  await Mob.deleteMany({});
  const user = new User({username: 'Tom', email:'tom24@gamil.com' })
  const registeredUser = await User.register(user,'tom');
  for (let i = 0; i < mobilesSeed.length; i++) {
    const mobData = mobilesSeed[i];
    const mobdet = new Mob({
      brand: mobData.brand,
      model: mobData.model,
      price: mobData.price,
      has5g: mobData.has5g,
      hasNfc: mobData.hasNfc,
      hasIrBlaster: mobData.hasIrBlaster,
      processorBrand: mobData.processorBrand,
      numCores: mobData.numCores,
      processorSpeed: mobData.processorSpeed,
      batteryCapacity: mobData.batteryCapacity,
      fastChargingAvailable: mobData.fastChargingAvailable,
      fastCharging: mobData.fastCharging,
      ramCapacity: mobData.ramCapacity,
      internalMemory: mobData.internalMemory,
      screenSize: mobData.screenSize,
      refreshRate: mobData.refreshRate,
      numRearCameras: mobData.numRearCameras,
      numFrontCameras: mobData.numFrontCameras,
      os: mobData.os,
      primaryCameraRear: mobData.primaryCameraRear,
      primaryCameraFront: mobData.primaryCameraFront,
      extendedMemoryAvailable: mobData.extendedMemoryAvailable,
      extendedUpto: mobData.extendedUpto,
      author: registeredUser._id,
images: [
  {
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', // any real image URL
    filename: 'unsplash-phone.jpg'
  }
]
    });
    await mobdet.save();
  }
}
seedDb().then(() => {
    mongoose.connection.close();
})
