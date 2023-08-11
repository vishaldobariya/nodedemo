const { body, check, validationResult } = require('express-validator');

const productFormValidation =  [
    body('name')
        .exists()
        .isLength({min: 6}).withMessage('Product name should be more than 6 character')
        .notEmpty().withMessage('Product name should not be empty')
        .trim(),
    body('product_number')
        .exists()
        .isNumeric().withMessage('Product number should be anumeric')
        .isLength({min: 6}).withMessage('Product number should be more than 6 character')
        .notEmpty().withMessage('Product number should not be empty')
        .trim(),
    function(req,res,next) {
        var errorValidation = validationResult(req);
        if ( !errorValidation.isEmpty() ) {
           let data = {
                status: 401,
                message: "Failed to create product!",
                data: errorValidation,
            };

            return res.json(data);
        }
        return next()
    }
];

const userFormValidation =  [
    body('name')
        .exists()
        .isLength({min: 6}).withMessage('Name should be more than 6 character')
        .notEmpty().withMessage('Name should not be empty')
        .trim(),
    body('username')
        .exists()
        .isLength({min: 6}).withMessage('Username should be more than 6 character')
        .notEmpty().withMessage('Username should not be empty')
        .trim(),
    body('password')
        .exists()
        .isLength({min: 6}).withMessage('Password should be more than 6 character')
        .notEmpty().withMessage('Password should not be empty')
        .trim(),
    function(req,res,next) {
        var errorValidation = validationResult(req);
        if ( !errorValidation.isEmpty() ) {
           let data = {
                status: 401,
                message: "Failed to create product!",
                data: errorValidation,
            };

            return res.json(data);
        }
        return next()
    }
];

const loginFormValidation =  [
    body('username')
        .exists()
        .isLength({min: 6}).withMessage('Username should be more than 6 character')
        .notEmpty().withMessage('Username should not be empty')
        .trim(),
    body('password')
        .exists()
        .isLength({min: 6}).withMessage('Password should be more than 6 character')
        .notEmpty().withMessage('Password should not be empty')
        .trim(),
    function(req,res,next) {
        var errorValidation = validationResult(req);
        if ( !errorValidation.isEmpty() ) {
           let data = {
                status: 401,
                message: "Failed to create product!",
                data: errorValidation,
            };

            return res.json(data);
        }
        return next()
    }
];

module.exports = { productFormValidation, userFormValidation, loginFormValidation}