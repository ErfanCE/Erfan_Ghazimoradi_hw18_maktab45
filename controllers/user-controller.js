const User = require('../models/user-model');
const path = require('path');
const persianDate = require('persian-date');

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

    // error(ece1003): properties empty value
    if (error.message.includes('ece1003')) {
        if (error.message.includes('username-empty')) return 'username-empty';
        if (error.message.includes('firstname-empty')) return 'firstname-empty';
        if (error.message.includes('lastname-empty')) return 'lastname-empty';
        if (error.message.includes('nationalNumber-empty')) return 'nationalNumber-empty';
    }

    // error(enum): properties enum value
    if (error.message.includes('not a valid enum value')) return 'gender-value';

    console.log(error.code, error.message);
    return false;
}

const userControll = {
    userProfile: (request, response) => {
        const targetUser = request.session.user;

        // format create at
        targetUser.createFormat = new persianDate(targetUser.createdAt).toCalendar('gregorian').toLocale('en').format('ddd, DD MMMM YYYY');

        response.render(path.join(__dirname, '../', 'views', 'user-profile'), {user: targetUser});
    },
    loginPermission: (request, response, next) => {
        if (!request.session.user) return response.redirect('/authentication/login');

        return next();
    },
    updateUser: (request, response) => {
        let targetUser = request.session.user;

        User.findOneAndUpdate({username: targetUser.username}, request.body, {new: true, runValidators: true}, (error, user) => {
            if (error)  {
                if (userValidation(error)) return response.send(userValidation(error));

                return console.log(error.message);
            }
            
            user.createAt = targetUser.createdAt;

            request.session.user = user;
            response.send('updated');
        });
    },
    deleteUser: (request, response) => {
        const targetUser = request.session.user;

        User.findOneAndDelete({username: targetUser.username}, (error, user) => {
            if (error) return console.log(error.message);

            response.clearCookie('user_sid');

            response.redirect('/authentication/login');
        });
    }
};


module.exports = userControll;