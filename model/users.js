"use strict";
var mongoose = require('mongoose');
var Promise = require('bluebird');
var bcrypt = require('bcryptjs');
Promise.promisifyAll(mongoose);
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        lowercase: true
    },
    lastName: String,
    created_on: {
        type: Date,
        default: new Date()
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        default: "12345"
    },
}, { versionKey: false });


UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};



var Users = mongoose.model('Users', UserSchema);
module.exports = Users;
