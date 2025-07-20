const mongoose = require('mongoose');
const localmongoosepassport = require('passport-local-mongoose');
const User = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
    username: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true 
  },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
cart: [
  {
    productId: String,
    model: String,
    brand: String,
    price: Number,
    quantity: Number,
    category: String,
    image: String
  }
]
})
User.plugin(localmongoosepassport);
module.exports = mongoose.model('User',User);