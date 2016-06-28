var
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Schema = mongoose.Schema,
  foodSchema = new Schema ({
    brand: String,
    servingSize: Number,
    servingSizeUnits: String,
    calories: Number,
    protein: Number,
    Fat: Number,
    carbohydrates: Number
  })

  userSchema = new Schema({
    local: {
      name: String,
      email: String,
      password: String
    },
    food: [foodSchema]
  })

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  //hashSync prevent other shits running before this happens
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password)
  //compareSync
}

var User = mongoose.model('User', userSchema)

module.exports = User
