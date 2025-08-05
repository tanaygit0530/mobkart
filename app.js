process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const Mob = require('./models/mobile');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const useRoutes = require('./routes/user');
const reviewRoutes = require('./routes/review')
const {isLoggedIn,isAuthor, wrapAsync,isReviewAuthor,isLaptopAuthor} = require('./middleware')
const AppError = require('./Apperror');
const Lap = require('./models/laptop');
const multer = require('multer');
const { storage, cloudinary } = require('./cloudinary'); 
const upload = multer({ storage });
const GoogleStrategy = require('./config/passportconfig')


const mongoose = require('mongoose');
const laptop = require('./models/laptop');
const MongoStore = require('connect-mongo');
const dbUrl =  process.env.DB_URL || 'mongodb://127.0.0.1:27017/mobkart';
mongoose.connect(dbUrl,{

})
.then(() => {
  console.log("✅ Connected to MongoDB");
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: 'thisisnotagoodsecret',
  touchAfter: 24 * 60 * 60 // in seconds
});

store.on("error",function(e) {
  console.log(e)
})

app.use(session({
  store: store,
  name: 'session',
  secret: 'thisisnotagoodsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)

app.use('/',useRoutes);
app.use('/',reviewRoutes);

app.get('/mobkart',(req,res) => {
  res.render('homepage/home');
})


app.get('/', (req, res) => {
  res.redirect('/mobkart');
});

// All Mobile Model
app.get('/mobkart/mobile', wrapAsync(async (req, res) => {
  const { search } = req.query;

  let mobiles;
  if (search) {
    mobiles = await Mob.find({ model: new RegExp(search, 'i') }).populate('author');
  } else {
    mobiles = await Mob.find({}).populate('author'); // show all mobiles
  }

  res.render('mobiles/index', { mobiles, search: search || '' });
}));

app.get('/mobkart/mobiles', async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    query = {
      $or: [
        { brand: regex },
        { model: regex }
      ]
    };
  }

  const mobiles = await Mob.find(query).populate('author');
  res.render('mobiles/index', { mobiles, search });
});
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

app.get('/mobkart/mobile/new',isLoggedIn,(req,res) => {
  res.render('mobiles/new');
})
app.get('/mobkart/mobile/:id/edit',isAuthor, async (req,res) => {
    const { id } = req.params;
  const mobile = await Mob.findById(id);
  res.render('mobiles/edit',{mobile});
})
app.get('/mobkart/mobile/cart', isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id);
  const cart = user.cart || [];
  res.render('cart/view', { cart });
});
app.get('/mobkart/mobile/:id', async (req, res) => {
  const { id } = req.params;
  const mobile = await Mob.findById(id).populate({path: 'reviews',populate: {path:'author'}}).populate('author');
    if (!mobile) {
    req.flash('error', 'Mobile not found');
    return res.redirect('/mobkart/mobile');
  }
  res.render('mobiles/show', { mobile });
});
app.post('/mobkart/mobile', isLoggedIn,upload.array('image'), async (req, res) => {
  const {
    brand, model, price, has5g, hasNfc, hasIrBlaster,
    processorBrand, numCores, processorSpeed, batteryCapacity,
    fastChargingAvailable, fastCharging, ramCapacity, internalMemory,
    screenSize, refreshRate, numRearCameras, numFrontCameras,
    os, primaryCameraRear, primaryCameraFront,
    extendedMemoryAvailable, extendedUpto
  } = req.body;

  const mobile = new Mob({
    brand,
    model,
    price: Number(price),
    has5g: has5g === 'true',
    hasNfc: hasNfc === 'true',
    hasIrBlaster: hasIrBlaster === 'true',
    processorBrand,
    numCores: Number(numCores),
    processorSpeed: Number(processorSpeed),
    batteryCapacity: Number(batteryCapacity),
    fastChargingAvailable: fastChargingAvailable === 'true',
    fastCharging: Number(fastCharging),
    ramCapacity: Number(ramCapacity),
    internalMemory: Number(internalMemory),
    screenSize: Number(screenSize),
    refreshRate: Number(refreshRate),
    numRearCameras: Number(numRearCameras),
    numFrontCameras: Number(numFrontCameras),
    os,
    primaryCameraRear: Number(primaryCameraRear),
    primaryCameraFront: Number(primaryCameraFront),
    extendedMemoryAvailable: extendedMemoryAvailable === 'true',
    extendedUpto: Number(extendedUpto),
    author: req.user._id
  });
  console.log(req.files); // Add this before .map

  mobile.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  await mobile.save();
  req.flash('success','Successfully Added Model!!')
  res.redirect('/mobkart/mobile');
});
app.put('/mobkart/mobile/:id', isLoggedIn, isAuthor, upload.array('image'), async (req, res) => {
  const { id } = req.params;

  const mobile = await Mob.findById(id);
  if (!mobile) {
    req.flash('error', 'Mobile not found!');
    return res.redirect('/mobkart/mobile');
  }

  Object.assign(mobile, {
    brand: req.body.brand,
    model: req.body.model,
    price: Number(req.body.price),
    has5g: req.body.has5g === 'true',
    hasNfc: req.body.hasNfc === 'true',
    hasIrBlaster: req.body.hasIrBlaster === 'true',
    processorBrand: req.body.processorBrand,
    numCores: Number(req.body.numCores),
    processorSpeed: Number(req.body.processorSpeed),
    batteryCapacity: Number(req.body.batteryCapacity),
    fastChargingAvailable: req.body.fastChargingAvailable === 'true',
    fastCharging: Number(req.body.fastCharging),
    ramCapacity: Number(req.body.ramCapacity),
    internalMemory: Number(req.body.internalMemory),
    screenSize: Number(req.body.screenSize),
    refreshRate: Number(req.body.refreshRate),
    numRearCameras: Number(req.body.numRearCameras),
    numFrontCameras: Number(req.body.numFrontCameras),
    os: req.body.os,
    primaryCameraRear: Number(req.body.primaryCameraRear),
    primaryCameraFront: Number(req.body.primaryCameraFront),
    extendedMemoryAvailable: req.body.extendedMemoryAvailable === 'true',
    extendedUpto: Number(req.body.extendedUpto)
  });
  const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
  mobile.images.push(...newImages);

  await mobile.save();
  req.flash('success', 'Successfully updated model!');
  res.redirect(`/mobkart/mobile/${mobile._id}`);
});

app.delete('/mobkart/mobile/:id',isLoggedIn,isAuthor, async(req,res) => {
  const {id} = req.params;
  const mobile = await Mob.findByIdAndDelete(id);
  req.flash('success','Successfully Deleted Model!!!');
  res.redirect('/mobkart/mobile');
})


// All Laptop Model
// app.get('/mobkart/laptop',async(req,res) => {
//   const laptops = await Lap.find({}).populate('author');
//   res.render('laptops/index',{laptops});
// })
app.get('/mobkart/laptop', async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    query = {
      $or: [
        { brand: regex },
        { model: regex }
      ]
    };
  }

  const laptops = await Lap.find(query).populate('author');
  res.render('laptops/index', { laptops, search });
});
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
app.get('/mobkart/laptop/new',isLoggedIn,async(req,res) => {
  res.render('laptops/new');
})
app.get('/mobkart/laptop/:id/edit',async(req,res) => {
  const {id} = req.params;
  const laptop = await Lap.findById(id);
  res.render('laptops/edit',{laptop});
})
app.get('/mobkart/laptop/:id',async(req,res) => {
  const {id} = req.params;
  const laptop = await Lap.findById(id).populate({path: 'reviews',populate: {path:'author'}}).populate('author');
    if (!laptop) {
    req.flash('error', 'Laptop not found!');
    return res.redirect('/mobkart/laptop');
  }
  res.render('laptops/show',{laptop})
})
app.post('/mobkart/laptop',isLoggedIn,upload.array('image'), async(req,res) => {
  const  {brand,model,price,processortier,processorbrand,rammemmory,primarystoragetype,storagecapacity,gpubrand,istouchscreen,displaysize,resolutionwidth,resolutionheight,os,warranty} = req.body;
  const newlaptop = new Lap({
    brand,
    model,
    price,
    processortier,
    processorbrand,
    rammemmory,
    primarystoragetype,
    storagecapacity,
    gpubrand,
    istouchscreen,
    displaysize,
    resolutionwidth,
    resolutionheight,
    os,
    warranty,
    author: req.user._id
  })
  console.log(req.files);
  newlaptop.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  await newlaptop.save();
  req.flash('success','Successfully Uploaded!!!');
  res.redirect('/mobkart/laptop');
})
app.put('/mobkart/laptop/:id', isLoggedIn, isLaptopAuthor, upload.array('image'), async (req, res) => {
  const { id } = req.params;
  const laptop = await Lap.findById(id);
  
  if (!laptop) {
    req.flash('error', 'Laptop not found!');
    return res.redirect('/mobkart/laptop');
  }
  Object.assign(laptop, {
    brand: req.body.brand,
    model: req.body.model,
    price: Number(req.body.price),
    processortier: req.body.processortier,
    processorbrand: req.body.processorbrand,
    rammemmory: Number(req.body.rammemmory),
    primarystoragetype: req.body.primarystoragetype,
    storagecapacity: Number(req.body.storagecapacity),
    gpubrand: req.body.gpubrand,
    istouchscreen: req.body.istouchscreen === 'true',
    displaysize: Number(req.body.displaysize),
    resolutionwidth: Number(req.body.resolutionwidth),
    resolutionheight: Number(req.body.resolutionheight),
    os: req.body.os,
    warranty: req.body.warranty
  });
  const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
  laptop.images.push(...newImages);

  await laptop.save();

  req.flash('success', 'Successfully edited laptop!');
  res.redirect(`/mobkart/laptop/${laptop._id}`);
});


app.delete('/mobkart/laptop/:id', isLoggedIn, isLaptopAuthor,async (req,res) => {
  const {id} = req.params;
  const laptop = await Lap.findByIdAndDelete(id);
  req.flash('success','Successfully Deleted laptop!!')
  res.redirect('/mobkart/laptop');
})

// cart Rouutes

app.post('/mobkart/mobile/cart/:id/add',isLoggedIn, wrapAsync(async (req, res) => {
  const mobile = await Mob.findById(req.params.id);
  console.log("Images:", mobile.images);
  const user = await User.findById(req.user._id);
  if (!user.cart) user.cart = [];

  const existing = user.cart.find(item => item.productId.toString() === req.params.id.toString());
  if (existing) {
    existing.quantity += 1;
  } else {
        let imageUrl = null;
    if (mobile.images && mobile.images.length > 0) {
      imageUrl = mobile.images[0].url;
    }


    user.cart.push({
      productId: mobile._id.toString(),
      model: mobile.model,
      brand: mobile.brand,
      price: mobile.price,
      quantity: 1,
      category: 'mobile',
      image:imageUrl
    });
  }
  console.log(user.cart);
  await user.save();
  req.flash('success', 'Item added to cart!');
  res.redirect('/mobkart/mobile');
}));

app.post('/mobkart/laptop/cart/:id/add',isLoggedIn, wrapAsync(async (req, res) => {
  const laptop = await Lap.findById(req.params.id);
  const user = await User.findById(req.user._id);
  if (!user.cart) user.cart = [];

  const existing = user.cart.find(item => item.productId.toString() === req.params.id.toString());
  if (existing) {
    existing.quantity += 1;
  } else {
            let imageUrl = null;
    if (laptop.images && laptop.images.length > 0) {
      imageUrl = laptop.images[0].url;
    }
    user.cart.push({
      productId: laptop._id.toString(),
      model: laptop.model,
      brand: laptop.brand,
      price: laptop.price,
      quantity: 1,
      category: 'laptop',
      image:imageUrl
    });
  }
   console.log(user.cart);
  await user.save();
  req.flash('success', 'Item added to cart!');
  res.redirect('/mobkart/laptop');
}));

app.get('/mobkart/cart', isLoggedIn, async(req, res) => {
  const user = await User.findById(req.user._id);
  const cart = user.cart || [];
  res.render('cart/view', { cart });
});

app.post('/mobkart/cart/:id/remove', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  user.cart = (user.cart || []).filter(item => item.productId !== id);
  await user.save();
  req.flash('success', 'Item removed from cart!');
  res.redirect('/mobkart/cart');
});
// Checkout Route

app.get('/checkout', isLoggedIn, async (req, res) => {
  const cart = req.user.cart; 
  let subtotal = 0;
  for (let item of cart) {
    subtotal += item.price * item.quantity;
  }
  const total = subtotal + 50; 

  res.render('checkout/view', { cart, subtotal, total });
});
app.get('/placeorder',(req,res) => {
  res.render('placeorder/view')
})
app.post('/checkout', isLoggedIn, async (req, res) => {
  const { fullName, phone, address, city, state, pincode } = req.body;
  req.session.shippingDetails = { fullName, phone, address, city, state, pincode };
  res.redirect('/placeorder');
});
app.get('/placeorder', isLoggedIn, async (req, res) => {
  res.render('placeorder/view',  );
});

//Payment Route
app.get('/mobkart/payment', isLoggedIn, async (req, res) => {
  const cart = req.user.cart;
  let subtotal = 0;
  for (let item of cart) {
    subtotal += item.price * item.quantity;
  }
  const total = subtotal + 50;

  res.render('payment/view', { cart, subtotal, total });
});



app.use((err,req,res,next) => {
  const {status = 500} = err;
  if(!err.message) err.message = 'Something went wrong!!!';
  res.status(status).render('error',{err});
})
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(404,'Page Not found'));
})
app.listen(3000, () => {
  console.log("Connnected to the Portal 3000!!!");
})




