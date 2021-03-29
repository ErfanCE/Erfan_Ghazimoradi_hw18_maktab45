const express = require('express');
const Router = express.Router();
const authenticationRoute = require('./authentication-route');
const userRoute = require('./user-route');


// root
Router.get('/', (request, response) => response.send('Root'));

// authentication route
Router.use('/authentication', authenticationRoute);

// user route
Router.use('/user', userRoute);


module.exports = Router;