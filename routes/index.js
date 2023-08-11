const express = require("express");
const router = express.Router();
const csrf = require('csurf');
const csrfProtect = csrf({ cookie: true })

const userRoutes = require('./user.js')
const productRoutes = require('./product.js')

router.get('/', csrfProtect, (req, res) => {
	if(req.session.loggedin){
		res.redirect('/user');
	} else {
		res.render('index', {title: 'Login', isLoggedin:req.session.loggedin, csrfToken: req.csrfToken(), messages: req.flash('info')});
	}
});

router.get('/login', csrfProtect, (req, res) => {
	if(req.session.loggedin){
		res.redirect('/user');
	} else {
		res.render('index', {title: 'Login', isLoggedin:req.session.loggedin, csrfToken: req.csrfToken(), messages: req.flash('info')});
	}
});

router.get('/logout', (req, res) =>  {
	req.session.loggedin = false;
	req.session.token = '';
	req.session.userData = '';
	res.redirect('/');
});

router.use("/", userRoutes);
router.use("/", productRoutes);

module.exports = router;