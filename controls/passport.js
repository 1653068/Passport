// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var models = require('../models');

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });


    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        models.Users
            .findOne({
                where: {
                    id: id
                }
            })
            .then((user) => {
                done(null, user);
            })
            .catch((error) => {
                done(err, null);
            });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, inputEmail, inputPassword, done) {
            models.Users
                .findOne({
                    where: {
                        email: inputEmail
                    }
                })
                .then((user) => {
                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        models.Users
                            .create({
                                username: inputEmail,
                                email: inputEmail,
                                password: inputPassword,
                                TypeId: 1
                            })
                            .then((newUser) => {
                                done(null, newUser);
                            })
                            .catch((error) => {
                                console.log(error);
                                done(null, false, req.flash('signupMessage', error));
                            });
                    }
                }).catch((error) => {
                    console.log(error);
                    done(null, false, req.flash('signupMessage', error));
                });

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, inputEmail, inputPassword, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            models.Users
                .findOne({
                    where: {
                        email: inputEmail
                    }
                })
                .then((user) => {
                    // if no user is found, return the message
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    }
                    // if the user is found but the password is wrong
                    if (!(user.validPassword(inputPassword))) {
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    }
                    // all is well, return successful user
                    console.log(user);
                    done(null, user);
                })
                .catch((err) => {
                    console.log(err);
                    if (err)
                        done(err);
                });
        }));


};