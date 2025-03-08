
/* Controller import starts */
const userCntrl = require('../controllers/userController');
/* Controller import  ends */

/* validate model import starts */
const userModel = require('../validate-models/userModel');
/* validate model  import  ends */
const auth = require('../middleware/auth');


module.exports = function (app, validator) {
   app.post('/api/user/signup',validator.body(userModel.signupUser),userCntrl.signupUser);
   app.post('/api/user/signin',validator.body(userModel.signinUser),userCntrl.signInUser);
   app.get('/api/user/getAllUser',userCntrl.getAllUser);
   app.get('/api/user/details/:id',validator.params(userModel.commonId),userCntrl.getUserDetails);
   app.delete('/api/user/delete/:id',validator.params(userModel.commonId),userCntrl.deleteUser);
}
