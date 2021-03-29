const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// collection name (lowercase & plural)
const collectionName = 'users';


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'ece1003: username-empty'],
        unique: [true, 'username-duplicate'],
        trim: true,
        validate(value) {
            if (value.length < 3) throw new Error('ece1001: username-length');

            // dont start with number
            if (!isNaN(value[0])) throw new Error('ece1002: username-type');
        }
    },
    password: {
        required: [true, 'ece1003: password-empty'],
        type: String,
        validate(value) {
            if (value.length < 4) throw new Error('ece1001: password-length');
        }
    },
    firstname: {
        type: String,
        required: [true, 'ece1003: firstname-empty'],
        trim: true,
        validate(value) {
            if (value.length < 2) throw new Error('ece1001: firstname-length');

            if (!isNaN(value[0])) throw new Error('ece1002: firstname-type');
        }
    },
    lastname: {
        type: String,
        required: [true, 'ece1003: lastname-empty'],
        trim: true,
        validate(value) {
            if (value.length < 2) throw new Error('ece1001: lastname-length');

            if (!isNaN(value[0])) throw new Error('ece1002: lastname-type');
        }
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'none'],
        default: 'none'
    },
    nationalNumber: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'ece1003: nationalNumber-empty'],
        validate(value) {
            if (value.length !== 10) throw new Error('ece1001: nationalNumber-length');

            if (isNaN(+value)) throw new Error('ece1002: nationalNumber-type');
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// hashing password before save user
UserSchema.pre('save', function(next) {
    // user on save
    const user = this;

    // new user created or password modified
    if (user.isNew || user.isModified('password')) {
        // generate salt(string with 10 char insert random in password)
        bcrypt.genSalt(10, (error, salt) => {
            // send error to save
            if (error) return next(error);

            bcrypt.hash(user.password, salt, (error, hash) => {
                // send error to save
                if (error) return next(error);

                // replace password with hashPass
                user.password = hash;
                return next();
            });
        });
    } else return next();
});


module.exports = mongoose.model(collectionName, UserSchema);