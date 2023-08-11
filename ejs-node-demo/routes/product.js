const express = require('express');
const router = express.Router();
const ProductController = require('./../controllers/ProductController');
const validation = require('./../middleware/validate.middleware.js');
const csrf = require('csurf');
const bodyParser = require("body-parser");
const { isLoggedIn } = require('./../middleware/user.middleware.js');
const csrfProtect = csrf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false });

//Front Routes
router.get('/product', isLoggedIn, csrfProtect, (req, res) => {
	res.render('product/index', {title: 'Product Listing', isLoggedin:req.session.loggedin, csrfToken: req.csrfToken(), messages: req.flash('info') });
});
router.get('/product/create', isLoggedIn, csrfProtect, (req, res) => {
	res.render('product/create', {title: 'Add Product', isLoggedin:req.session.loggedin, csrfToken: req.csrfToken(), messages: req.flash('info') });
});
router.get('/product/edit/:id', isLoggedIn, csrfProtect,  ProductController.getContent);

router.delete('/api/v1/product/delete/:id', parseForm, csrfProtect, ProductController.remove);
router.delete('/api/v1/product/deleteImage/:id', parseForm, csrfProtect, ProductController.deleteImage);
router.get('/api/v1/product/export', ProductController.productExport);
router.post('/api/v1/product/import',ProductController.productImport);
router.post('/api/v1/product/', ProductController.getAll);
router.get('/api/v1/product/:id', ProductController.getById);
router.post('/api/v1/product/create',  parseForm, csrfProtect, validation.productFormValidation, ProductController.create);
router.put('/api/v1/product/edit/:id', parseForm, csrfProtect, validation.productFormValidation, ProductController.update);


module.exports = router;