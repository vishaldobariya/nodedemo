const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const i18n = require('./../config/i18n');
const config = require('./../config/constants');
const XLSX = require("xlsx"); 
const fs = require("fs"); 
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getContent = async (req, res) => {
 	try{
		var id = req.params.id;

		const product_data = await req.models.Products.findOne({
			attributes: ['id', 'name', 'product_number', 'file'],
	        where: {
	            id: id,
	            is_deleted: 0
	        }
	    });
	   
	    let view_data = {
			data: product_data,
	      	title: 'Edit Product',
	      	isLoggedin:req.session.loggedin,
	      	csrfToken: req.csrfToken(),
	      	id: id, 
	      	userData:req.session.userData, 
	      	messages: req.flash('info')
	    }

	    res.render('product/edit',view_data)
  	}
    catch (error) {
		// utils.logError(`${error.status || 500} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${error.message}`);  
		console.log(error.message);
    }    
}

const deleteImage = async (req, res) => {
    try {
        if (req.params.id && req.params.id > 0) {
            let delFlag = true;

            const image_exists = await req.models.Products.findOne({
                where: {
                    id: req.params.id
                }
            });

            if (image_exists) {
                // delete files from phsical location
                fs.stat('public/uploads/product/' + image_exists.file, function(err, stats) {
                    if (err) {
                        delFlag = false;
                        res.status(400).json({
                            code: 400,
                            status: false,
                            errors: [{
                                field: "image",
                                message: "Image not exist!1"
                            }]
                        });
                    }

                    fs.unlink('public/uploads/product/' + image_exists.file, function(err) {
                        if (err) {
                            delFlag = false;
                            res.status(400).json({
                                code: 400,
                                status: false,
                                errors: [{
                                    field: "image",
                                    message: "Image not exist!2"
                                }]
                            });
                        }
                        // utils.logError('file deleted successfully');
                    });
                });

                // update image related entry to null
                if (delFlag) {
                    await req.models.Products.update({
                        file: null,
                        updated_by: 1,
                        updatedAt: new Date()
                    }, {
                        where: {
                            id: req.params.id
                        }
                    });

                    req.flash('info', 'Image deleted successfully!');

                    res.status(200).json({
                        code: 200,
                        status: true,
                        message: "Image deleted successfully!"
                    });
                }

            } else {
                res.status(400).json({
                    code: 400,
                    status: false,
                    errors: [{
                        field: "image",
                        message: "Image not exist!3"
                    }]
                });
            }
        }
    } catch (error) {
        // utils.logError(`${error.status || 500} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${error.message}`);
        res.status(500).json({
            code: 500,
            status: false,
            errors: [{
                field: "general",
                message: error.message
            }]
        });
    }
}

const create = async (req, res) => {
	try{
		if (!req.files) {
			let data = {status: 0, message: 'Please upload file!'};
			return res.json(data);
		}

		var file = req.files.file;
		var filename = Date.now() + '-' + file.name;
		var path =  filename;

		file.mv(path, (err) => {
			if (err) {
			  	let data = {status: 0, message: 'failed to upload file'};
				return res.json(data);
			}

			const payload = {
				name: req.body.name, 		
				product_number: req.body.product_number, 		
				file:filename,
				created_by:req.session.userData.data.id
			};

			req.models.Products.findOne({
		        where: {
		            product_number: payload.product_number,
		            is_deleted: 0
		        }
		    }).then(result => {
		        if(result !== null && typeof result !== 'undefined'){
		        	let data = {status: 302, message: i18n.__('product_already_exist')};
					return res.json(data);
		        } else {
		        	// Save Product in the database
					req.models.Products.create(payload).then(result1 => {
						let data = {status: 200, message: i18n.__('product_create_success')};
						res.send(data);
					})
					.catch(err => {
						console.error('Failed to create product : ', error);
						let data = {status: 0, message: i18n.__('product_create_failed')};
						return res.json(data);
					});
		        }
		    }).catch((error) => {
		        console.error('Failed to retrieve product : ', error);
		        let data = {status: 0, message: i18n.__('product_create_failed')};
				return res.json(data);
		    });
		});
	}
	catch(error){
		res.json({
            status: 500,
            message: error.message
        });
	}
}

const update = async (req, res) => {
	try{
		if (!req.files) {
			let data = {status: 0, message: 'Please upload file!'};
			return res.json(data);
		}

		const file = req.files.file;
		var filename = Date.now() + '-' + file.name;

		const path =  filename;

		file.mv(path, (err) => {
			if (err) {
			  	let data = {status: 0, message: 'failed to upload file'};
				return res.json(data);
			}

			let id = req.params.id;
			const payload = {
				name: req.body.name, 		
				product_number: req.body.product_number, 		
				updated_by:req.session.userData.data.id,
				file: filename
			};

			req.models.Products.findOne({
		        where: {
		            product_number: payload.product_number,
		            is_deleted: 0,
	             	id: {
				      [Op.not]: [id]
				    }
		        }
		    }).then(result => {
		        if(result !== null && typeof result !== 'undefined'){
		        	let data = {status: 302, message: i18n.__('product_already_exist')};
					return res.json(data);
		        } else {
		        	// Save Product in the database
					req.models.Products.update(payload, { where: { id : id} }).then(result1 => {
						req.flash('info', i18n.__('product_update_success'));
						let data = {status: 200, message: i18n.__('product_update_success')};
						res.send(data);
					})
					.catch(err => {
						console.error('Failed to create product : ', error);
						let data = {status: 0, message: i18n.__('product_update_failed')};
						return res.json(data);
					});
		        }
		    }).catch((error) => {
		        console.error('Failed to retrieve product : ', error);
		        let data = {status: 0, message: i18n.__('product_update_failed')};
				return res.json(data);
		    });
		});
	}
	catch(error){
		res.json({
            status: 500,
            message: error.message
        });
	}
}

const remove = async (req, res) => {
	try{
		const id = req.params.id;

		//soft delete product
		req.models.Products.update(
			{ is_deleted: 1 },
			{ where: { id : id} }
		)
		.then(result => {
			req.flash('info', i18n.__('product_delete_success'));
			let data = {status: 200, message: i18n.__('product_delete_success')};
			res.send(data);
		})
		.catch(err => {
			console.error('Failed to create product : ', error);
			let data = {status: 0, message: i18n.__('product_delete_failed')};
			return res.json(data);
		});
	}
	catch(error){
		res.json({
            status: 500,
            message: error.message
        });
	}
}

const getById = async (req, res) => {
 	try{
		var id = req.params.id;
		const product_data = await req.models.Products.findOne({
	        where: {
	            id: id,
	            is_deleted: 0
	        }
	    });
	    
	    if(product_data){
    	 	res.json({
	            status: 0,
	            message: i18n.__('product_get_successfully'),
	            data:product_data
	        });
	    } else {
		    res.json({
	            status: 0,
	            message: i18n.__('product_not_found'),
	        });
	    }
  	}
    catch (error) {
		// utils.logError(`${error.status || 500} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${error.message}`);  
	 	res.json({
            status: 500,
            message: error.message
        });
    } 
}

const getAll = async (req, res) => {
	try{
		var start = parseInt(req.body.start),
		length = parseInt(req.body.length), 		
		keyword = req.body.search['value'],
		order = req.body.order[0]['dir'],
		column = req.body.order[0]['column'];

		const product_data = await req.models.Products.findAll({
	        where: {
	            is_deleted: 0
	        }
	    });
	    
	    if(product_data.length > 0){
    		//search 
			let where_obj = {
				is_deleted: 0
			}

			if(keyword !== null && keyword !== undefined && keyword !== ''){
				where_obj[Op.or] = [
					{
						name: {
							[Op.like]: "%" + keyword+ "%"
						}
					},
					{
						product_number: {
							[Op.like]: "%" + keyword + "%"
						}
					}
				];
			}

			// ordering
			let orderby = ['id', 'desc'];
			if(order !== null && order !== undefined && order !== '')
			{
				let columnName = 'id';
				if(column == 0){
					columnName = 'id';
				} else if(column == 1){
					columnName = 'name';
				} else if(column == 2){
					columnName = 'product_number'
				} 

			 	orderby = [columnName, order];
			}

	    	const filter_product_data = await req.models.Products.findAll({
    		  	attributes: [
		            'id', 
		            'name', 
		            'product_number', 
		            'is_deleted', 
		            'file',
		            [Sequelize.fn('date_format', Sequelize.col('createdAt'), config.DATE_FORMAT), 'createdAt'],
		            [Sequelize.fn('date_format', Sequelize.col('updatedAt'), config.DATE_FORMAT), 'updatedAt'],
		            'created_by',
		            'updated_by'
		        ],
		        where: where_obj,
	         	order: [orderby],
	         	offset: start, 
	         	limit: length,
		    });

    	 	if(filter_product_data.length > 0){
	    	 	res.json({
		          	status: 200,
			   		message: i18n.__('product_get_successfully'),
		   		  	iTotalRecords: filter_product_data.length,
		    		iTotalDisplayRecords: product_data.length,
			   		aaData: filter_product_data,
		        });
	        } else {
        	  	res.json({
		            status: 0,
			   		message: i18n.__('product_not_found'),
		   			iTotalRecords: 0,
		    		iTotalDisplayRecords: 0,
			   		aaData: []
		        });
	        }

	    } else {
		    res.json({
	            status: 0,
		   		message: i18n.__('product_not_found'),
	   			iTotalRecords: 0,
	    		iTotalDisplayRecords: 0,
		   		aaData: []
	        });
	    }
  	}
    catch (error) {
		// utils.logError(`${error.status || 500} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${error.message}`);  
	 	res.json({
            status: 500,
            message: error.message,
			iTotalRecords: 0,
    		iTotalDisplayRecords: 0,
	   		aaData: []
        });
    } 
}

const productExport =  async (req, res) => {
    const products = await req.models.Products.findAll({
        attributes: [
            'id', 
            'name', 
            'product_number', 
            'is_deleted', 
            'file',
            'createdAt',
            'updatedAt',
            'created_by',
            'updated_by'
        ],
        raw: true
    }); 

    const headings = [
        ['Id', 'Name', 'productNumber', 'isDeleted', 'File', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy']
    ]; 

    const wb = await XLSX.utils.book_new();
    const ws = await XLSX.utils.json_to_sheet(products, { 
        origin: 'A2', 
        skipHeader: true 
    });
    XLSX.utils.sheet_add_aoa(ws, headings); 
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    const buffer = await XLSX.write(wb, { bookType: 'csv', type: 'buffer' }); 
    res.attachment('products.csv');

    return res.send(buffer);
}

const productImport = async (req, res) => {
	//https://www.ultimateakash.com/blog-details/IixTPGAKYAo=/How-to-Import-Export-Excel-&-CSV-In-Node.js-2022
	if (!req.files) {
		let data = {status: 0, message: 'Please upload file!'};
		return res.json(data);
	}

	const file = req.files.file;
	var filename = Date.now() + '-' + file.name;

	const path = "/home/jignesh.mer@hs.local/projects/panteon/node-demos/ejs-node-demo/public/csv/" + filename;

	file.mv(path, (err) => {

	    const wb = XLSX.readFile("/home/jignesh.mer@hs.local/projects/panteon/node-demos/ejs-node-demo/public/csv/" + filename); 
	    const sheets = wb.SheetNames;
	    if(sheets.length > 0) {
	        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
	        const products = data.map(row => ({
	            name: row['Name'],
	            product_number: row['productNumber'],
	            is_deleted: row['isDeleted'],
	            file: row['File'],
	            created_by: row['createdBy'],
	            updated_by: row['updatedBy']
	        }))
	        req.flash('info', 'Products uploaded successfully!');
	        req.models.Products.bulkCreate(products); 
	    }
	    return res.redirect('/product');
    });
}

module.exports = { create, update, remove, getById, getAll, productExport, productImport,  getContent, deleteImage };