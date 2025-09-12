const controller = require('../controllers/user.controller');
const UserModel = require('../models/user.model');
const userService = require('../services/user.service');                                        
const {validationResult} = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});  
}
const {fullname, lastname, email, password} = req.body;

const hashedPassword = await UserModel.hashPassword(password);

const user = await userService.createUser({
    firstname:fullname.firstname, 
    lastname: fullname.lastname, 
    email, password: hashedPassword});
const token = user.generateAuthToken();
res.status(201).json({message: 'User registered successfully', user, token});

}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});  
    }

    const {email, password} = req.body;
    const user = await UserModel.findOne({email}).select('+password');
    if (!user) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
    }


    const token = user.generateAuthToken();
    
    res.cookie('token', token);

    res.status(200).json({message: 'Login successful', user, token});
}

module.exports.getUserProfile = async (req, res, next) => {
res.status(200).json(req.user);
}


module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization && req.headers.authorization.split(" ")[1];
await blacklistTokenModel.create({token});

    res.status(200).json({message: 'Logout successful'});
}