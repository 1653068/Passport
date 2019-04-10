module.exports = function (app, passport) {
    var models = require('../models');
    app.get('/sync', (req, res) => {
        models.sequelize.sync().then(() => {
            res.send('Database sync complete!');
        });
    });

    app.get('/create', (req, res) => {
        models.Types
            .bulkCreate([{
                    name: 'local'
                },
                {
                    name: 'Facebook'
                },
                {
                    name: 'Google+'
                },
                {
                    name: 'Twitter'
                }
            ])
            .then((Types) => {
                res.json(Types);
            })
            .catch((error) => {
                res.json(error);
            })
    })

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', (req, res) => {
        res.render('index');
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', (req, res) => {
        // render the page and pass in any flash data if it exists
        res.render('login', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    app.get('/signup', (req, res) => {
        // render the page and pass in any flash data if it exists
        res.render('signup', {
            message: req.flash('signupMessage')
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // Facebook ==============================
    // =====================================
    app.get('/auth/facebook',
        passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        }));


    // =====================================
    // Google ==============================
    // =====================================
    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['profile']
        }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}