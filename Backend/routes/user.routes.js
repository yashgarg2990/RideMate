const express = require('express') 
const router = express.Router();
const middleware = require('../middleware/auth.middleware')

const {body} = require("express-validator")
const userController = require('../controllers/user.controllers')

router.post('/register' , [
    body('email').isEmail().withMessage('Invalid Email') , 
    body('password').isLength({min: 8}).withMessage('Password must be at 8 characters long') , 
    body('fullname.firstname').isLength({min:3}).withMessage(
        'First name must be at least 3 characters long'),
    
], userController.registerUser)

router.post('/login' , [
    body('email').isEmail().withMessage('Invalid Email') , 
    body('password').isLength({min: 8}).withMessage('Password must be at 8 characters long') , 
], userController.loginUser)

router.get('/profile',middleware.authMiddleware ,userController.getUserProfile)
router.get('/logout', middleware.authMiddleware, userController.logoutUser)





module.exports = router ; 
