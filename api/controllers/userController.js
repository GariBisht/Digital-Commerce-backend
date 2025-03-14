
const becryptService = require('../services/bcrypt.services');
const jwtService = require('../services/jwt.services');
const resModel = require('../lib/resModel');
const userServices = require('../services/user.service');
let User = require("../models/userModel");
const bcryptServices = require('../services/bcrypt.services');

/**
 * @api {post} /api/user/signup Signup User
 * @apiName Signup User
 * @apiGroup User
 * @apiBody {String} first_name User FirstName.
 * @apiBody {String} last_name User LastName.
 * @apiBody {String} email User Email.
 * @apiBody {String} password Password.
 * @apiBody {String} confirmPassword ConfirmPassword.
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/signup
 */
module.exports.signupUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirmPassword } = req.body;
        const userCheck = await User.findOne({ email });
        if (userCheck) {
            resModel.success = false;
            resModel.message = "User  Already Exists";
            resModel.data = null;
            res.status(201).json(resModel);
        } else {
            if (password == confirmPassword) {
                let passwordHash = await becryptService.generatePassword(password)
                if (passwordHash) {
                    let userInfo = {
                        email: email.toLowerCase(),
                        password: passwordHash,
                        first_name: first_name,
                        last_name: last_name,
                        role_id: 2
                    }
                    const newUser = new User(userInfo);
                    let users = await newUser.save();
                    if (users) {
                        resModel.success = true;
                        resModel.message = "User Added Successfully";
                        resModel.data = users
                        res.status(200).json(resModel)

                    } else {
                        resModel.success = false;
                        resModel.message = "Error while creating User";
                        resModel.data = null;
                        res.status(400).json(resModel);
                    }
                } else {
                    resModel.success = false;
                    resModel.message = "Something went wrong";
                    resModel.data = null;
                    res.status(500).json(resModel)
                }
            } else {
                resModel.success = false;
                resModel.message = "Please enter password and confirm should be same";
                resModel.data = null;
                res.status(500).json(resModel);
            }
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);

    }
}
/**
 * @api {post} /api/user/signin Signin User
 * @apiName SinginUser
 * @apiGroup User
 * @apiBody {String} email User Email.
 * @apiBody {String} password Password.
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/signin
 */
module.exports.signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emails = email.toLowerCase();

        // Find user by email
        const userCheck = await User.findOne({ email: emails });
        if (!userCheck) {
            resModel.success = false;
            resModel.message = "Please create an account first";
            resModel.data = null;
            return res.status(400).json(resModel);
        }

        // Compare password
        const passwordMatch = await bcryptServices.comparePassword(password, userCheck.password);
        if (!passwordMatch) {
            resModel.success = false;
            resModel.message = "Invalid Credentials";
            resModel.data = {};
            return res.status(400).json(resModel);
        }
  
        // Generate JWT token
        const accessToken = await jwtService.issueJwtToken({
            email,
            first_name: userCheck.first_name,
            id: userCheck._id, // MongoDB uses _id instead of id
        });

        // Remove password from response
        userCheck.password = undefined;

        resModel.success = true;
        resModel.message = "User Login Successfully";
        resModel.data = { token: accessToken, user: userCheck };
        res.status(200).json(resModel);
        
    } catch (error) {
        resModel.success = false;
        resModel.message = error.message;
        resModel.data = null;
        res.status(500).json(resModel);
    }
};

/**
 * @api {get} /api/user/getAllUser  Get All User
 * @apiName Get All User
 * @apiGroup User
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/getAllUser
 */
module.exports.getAllUser = async (req, res) => {
    try {
        const userCheck = await userServices().getAllUsers(req.query);
        if (userCheck) {
            resModel.success = true;
            resModel.message = "Get All Users Successfully";
            resModel.data = userCheck ;
            res.status(200).json(resModel);
        }
        else {
            resModel.success = false;
            resModel.message = "Something went wrong";
            resModel.data = null;
            res.status(500).json(resModel)
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
}



/**
 * @api {get} /api/user/details/:id  Get User Details
 * @apiName Get User Details
 * @apiGroup User
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/details/:id
 */
module.exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        let _id = id
        // Find product by ID
        const user = await User.findById(_id);
        if (!user) {
            resModel.success = false;
            resModel.message = "User Does't Exists";
            resModel.data = null;
            res.status(400).json(resModel)
        } else {
            resModel.success = true;
            resModel.message = "User Details Fetched Successfully";
            resModel.data = user;
            res.status(200).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internel Server Error";
        resModel.data = null;
        res.status(500).json(resModel)
    }
};

/**
 * @api {delete} /api/user/delete/:id  Delete User 
 * @apiName Delete User
 * @apiGroup User
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/delete/:id
 */
module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        let _id = id
        // Check if the product exists
        const existingUser = await User.findById(_id);
        if (!existingUser) {
            resModel.success = false;
            resModel.message = "User Does't Exists";
            resModel.data = null;
            res.status(400).json(resModel);
        }
        let deleteRes = await User.findByIdAndDelete(_id);
        if (deleteRes) {
            resModel.success = true;
            resModel.message = "User Deleted Successfully";
            resModel.data = null;
            res.status(200).json(resModel);
        } else {
            resModel.success = false;
            resModel.message = "Error While User Deleting";
            resModel.data = null;
            res.status(400).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};


