var express = require("express");
var app = express();
let hbs = require('express-handlebars');

var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

app.use(express.static(__dirname + "/public"));

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}));

app.set('view engine', 'hbs');


app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./controls/route.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.set("port", process.env.PORT || 5000);
app.listen(app.get("port"), () => {
  console.log("Server is listening on port " + app.get("port"));
});