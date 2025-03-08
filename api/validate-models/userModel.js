 var joi = require("joi");

module.exports.signinUser = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
})

module.exports.signupUser = joi.object({
  email: joi.string().email().required(),
  first_name:joi.string().required(),
  last_name:joi.string().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().required(),
})
module.exports.commonId = joi.object({
    id: joi.string().required(),

})

module.exports.updateUser = joi.object({
  first_name:joi.string().required(),
  last_name:joi.string().required(),
  email:joi.string().required(),
})

module.exports.updateUserid = joi.object({
  id:joi.number().integer().required()
})

module.exports.deleteUser = joi.object({
  id:joi.number().integer().required()
})

module.exports.getdatabyid = joi.object({
  id:joi.number().integer().required()
})

module.exports.verifyOtp = joi.object({
  email: joi.string().email().required(),
  otp: joi.number().integer().required()
})

module.exports.sendOtp = joi.object({
  email: joi.string().email().required(),
})