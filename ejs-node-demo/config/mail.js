const nodemailer = require("nodemailer");

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
let testAccount =  nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	secure: false, // true for 465, false for other ports
	auth: {
	  user: 'fd592dc7f883e2', // generated ethereal user
	  pass: 'f59009faef03da', // generated ethereal password
	},
});

module.exports = transporter