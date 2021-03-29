const express = require('express');
const router = express.Router();
const authenticationControll = require('../controllers/authentication-controller');


// registeration page
router.get('/registeration', authenticationControll.checkSession, authenticationControll.registerationPage);

// register user
router.post('/register', authenticationControll.registerUser);

// login page
router.get('/login', authenticationControll.checkSession, authenticationControll.loginPage);

// login user
router.post('/login-user', authenticationControll.loginUser);

// logout user
router.get('/logout', authenticationControll.logout);


module.exports = router;