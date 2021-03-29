const path = require('path');
const User = require('../models/user-model');
const bcrypt = require('bcrypt');


function userValidation(error) {
    // error(11000): duplicate uniqe properties
    if (error.code === 11000) {
        if (error.message.includes('username')) return 'username-duplicate';
        if (error.message.includes('nationalNumber')) return 'nationalNumber-duplicate';
    }

    // error(ece1001): properties length
    if (error.message.includes('ece1001')) {
        if (error.message.includes('username-length')) return 'username-length';
        if (error.message.includes('password-length')) return 'password-length';
        if (error.message.includes('firstname-length')) return 'firstname-length';
        if (error.message.includes('lastname-length')) return 'lastname-length';
        if (error.message.includes('nationalNumber-length')) return 'nationalNumber-length';
    }

    // error(ece1002): properties type
    if (error.message.includes('ece1002')) {
        if (error.message.includes('username-type')) return 'username-type';
        if (error.message.includes('firstname-type')) return 'firstname-type';
        if (error.message.includes('lastname-type')) return 'lastname-type';
        if (error.message.includes('nationalNumber-type')) return 'nationalNumber-type';
    }

    // error(cast) : properties type
    if (error.message.includes('Cast to date failed')) return 'dateOfBirth-type';

    // error(ece1003): properties empty value
    if (error.message.includes('ece1003')) {
        if (error.message.includes('username-empty')) return 'username-empty';
        if (error.message.includes('password-empty')) return 'password-empty';
        if (error.message.includes('firstname-empty')) return 'firstname-empty';
        if (error.message.includes('lastname-empty')) return 'lastname-empty';
        if (error.message.includes('nationalNumber-empty')) return 'nationalNumber-empty';
        if (error.message.includes('dateOfBirth-empty')) return 'dateOfBirth-empty';
    }

    // error(enum): properties enum value
    if (error.message.includes('not a valid enum value')) return 'gender-value';

    console.log(error.code, error.message);
    return false;
}


const authenticationControll = {
    registerationPage: (request, response) => {
        response.render(path.join(__dirname, '../', 'views', 'authentication', 'registeration'), {alert: request.query.result});
    },
    registerUser: (request, response) => {
        // empty field
        // if (!request.body.username || !request.body.password) return response.redirect('/authentication/registeration?result=empty-field');

        // User.findOne({username: request.body.username.trim()}, (err, user) => {
        //     if (err) return console.log(err.message);

        //     // duplicate username
        //     if (user) return response.redirect('/authentication/registeration?result=username-duplicate');

        // });

        // save user
        new User({
            firstname: request.body.firstname.trim(),
            lastname: request.body.lastname.trim(),
            username: request.body.username.trim(),
            password: request.body.password,
            nationalNumber: request.body.nationalNumber.trim(),
            gender: request.body.gender
        }).save((err, user) => {
            if (err) {
                if (userValidation(err)) return response.redirect(`/authentication/registeration?result=${userValidation(err)}`);
            }

            response.redirect('/authentication/login');
        });
    },
    loginPage: (request, response) => {
        return response.render(path.join(__dirname, '../', 'views', 'authentication', 'login.ejs'), {alert: request.query.result});
    },
    loginUser: (request, response) => {
        // empty field
        if (!request.body.username || !request.body.password) return response.redirect('/authentication/login?result=empty-field');

        User.findOne({username: request.body.username.trim()}, (error, user) => {
            // username not found
            if (!user) return response.redirect('/authentication/login?result=not-found');


            // compare passwords
            bcrypt.compare(request.body.password, user.password, (err, isMatch) => {
                if (err) return console.log(err.message);

                // password not match
                if (!isMatch) return response.redirect('/authentication/login?result=not-match');

                // user information cookie 
                request.session.user = user;

                response.redirect(`/user/profile`);
            });
        });
    },
    checkSession: (request, response, next) => {
        if (request.cookies.user_sid && request.session.user) return response.redirect('/user/profile');

        return next();
    },
    logout: (request, response) => {
        response.clearCookie('user_sid');

        response.redirect('/authentication/login');
    }
};


module.exports = authenticationControll;