const express = require('express');
const router = express.Router();
const userControll = require('../controllers/user-controller');


// main
// router.get('/', userControll.userProfile);

// users profile
router.get('/profile', userControll.loginPermission, userControll.userProfile);

router.patch('/update', userControll.loginPermission, userControll.updateUser);

router.get('/delete', userControll.loginPermission, userControll.deleteUser);


module.exports = router;