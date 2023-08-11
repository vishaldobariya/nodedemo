const express = require('express');
const router = express.Router();
const User = require('./../controllers/UserController');
const validation = require('./../middleware/validate.middleware.js');
const csrf = require('csurf');
const bodyParser = require("body-parser");
const { isLoggedIn } = require('./../middleware/user.middleware.js');
const csrfProtect = csrf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false });

//Front Routes
router.get('/user', isLoggedIn, csrfProtect, (req, res) => {
	res.render('user/index', {title: 'User Listing', isLoggedin:req.session.loggedin, csrfToken: req.csrfToken(), messages: req.flash('info') });
});
router.get('/user/create', isLoggedIn, csrfProtect, (req, res) => {
	res.render('user/create', {title: 'Add User', isLoggedin:req.session.loggedin, csrfToken: req.csrfToken(), messages: req.flash('info') });
}); 
router.get('/user/edit/:id', isLoggedIn, csrfProtect,  User.getContent);

router.delete('/api/v1/user/delete/:id', parseForm, csrfProtect, User.remove);
router.delete('/api/v1/user/deleteImage/:id', parseForm, csrfProtect, User.deleteImage);
router.get('/api/v1/user/export', User.userExport);
router.post('/api/v1/user/import',User.userImport);
router.post('/api/v1/user/', User.getAll);
router.get('/api/v1/user/:id', User.getById);
router.post('/api/v1/user/create', parseForm, csrfProtect, validation.userFormValidation, User.create);
router.put('/api/v1/user/edit/:id', parseForm, csrfProtect, validation.userFormValidation, User.update);
router.post('/api/v1/user/login', parseForm, csrfProtect, User.login);

module.exports = router;