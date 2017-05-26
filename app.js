const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const passport = require('passport');

const index = require('./routes/index');
const lirik = require('./routes/lirik');
const restaurants = require('./routes/restaurants');
const user = require('./routes/user');
const twitter = require('./routes/twitter');

mongoose.connect('mongodb://localhost/cari_resto')

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', index);
app.use('/restaurants', restaurants);
app.use('/lirik', lirik);
app.use('/user', user);
app.use('/twitter', twitter);

app.listen(3000, () => console.log("Listening on port 3000"));
