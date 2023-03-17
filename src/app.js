require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require("connect-flash");
const methodOverride = require('method-override')
const path = require('path');

const User = require('./models/user');

const auth = require('./controllers/auth');
const events = require('./controllers/events');
const users = require('./controllers/users');

const app = express();
const port = process.env.PORT || 5000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.locals.moment = require('moment');
app.locals.moment.locale();

const secret = process.env.SESSION_SECRET || 'fuCQR?cNtrIugPMqpPPu29P-M';
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.use(User.createStrategy());

passport.use(new LocalStrategy({
    usernameField: 'email'
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.set('strictQuery', true);

app.use((req, res, next) => {
    res.locals.current_user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', auth);
app.use('/eventos', events);
app.use('/mis_eventos', users);
app.use(express.static('src/views/public'));
app.use(methodOverride('_method'))

const dbUrl = process.env.DB_URL || "mongodb://localhost/HobbyBuddy";
mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(async () => {
        console.log('DB Connected.');

        app.listen(port, () => {
            console.log(`HobbyBuddy server listening at http://localhost:${port}`)
        });
    })
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
        process.exit(1);
    });


app.get("*", (req, res) => {
    res.render('error');
});