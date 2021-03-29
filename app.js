const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const appConfig = require('./config');
const appRoutes = require('./routes/app-routes');


// connect MongoDB
mongoose.connect(appConfig.databaseUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// mongoose error handler
mongoose.connection.on('error', (error) => {
    console.log(error);
});


// mongoose connect status
mongoose.connection.once('open', () => {
    console.log('serever connected successfully to database.');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// request body parser (extended: true => support nested object)
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// request cookie parser
app.use(cookieParser());

// express session setup
app.use(session({
    key: 'user_sid',
    secret: 'sessionID',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1*60*60}
}));

// static public
app.use(express.static('public'));
app.use('/authentication', express.static(path.join(__dirname, 'public')));
app.use('/user', express.static(path.join(__dirname, 'public')));

// clear empty cookie
app.use((request, response, next) => {
    // clear cookie if user session not exist
    if (request.cookies.user_sid && !request.session.user) response.clearCookie('user_sid');

    next();
});

// app routes
app.use('/', appRoutes);


// 404: Page not found
app.use('*', (request, response) => {
    response.render(path.join(__dirname, 'views', 'error', '404-page.ejs'));
});


app.listen(appConfig.serverPort, (request, response) => {
    console.log(`Server is Running on :${appConfig.serverPort}`);
});