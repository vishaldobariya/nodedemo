const express = require('express');
const bodyParser = require("body-parser");
const { isLoggedIn } = require('./middleware/user.middleware.js');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const session = require('express-session');
const moment = require('moment');
const flash = require('connect-flash');
const i18n = require('./config/i18n');
const constants = require('./config/constants');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require("express-fileupload");
const path = require("path");
const models = require("./db/models");
const indexRouter = require("./routes/index");

const csrfProtect = csrf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false });
const app = express();
const port = process.env.PORT || 8001;

moment.tz.setDefault(constants.TIMEZONE);

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

app.use(fileUpload());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(i18n.init);

app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "./public")));
// app.use('/css', express.static(__dirname + 'public/css'))

//set database connection
app.use(async (req, res, next) => {
  req.models = models;
  next();
});

app.use("/", indexRouter);

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', csrfProtect, function(req, res){
  res.render('error/notfound', {title: 'Page not found!', isLoggedin:req.session.loggedin, csrfToken: req.csrfToken(), messages: req.flash('info') });
});

// error handler
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
	let data = {
   		status: 0,
   		message: "Invalid csrf token!"
	};

  	res.send(data);
})

app.listen(port, () => {
	console.log(`server srart on port ${port}`);
});
