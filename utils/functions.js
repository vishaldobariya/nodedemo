const { successlog, errorlog } = require("./logger");
const moment = require('moment');

module.exports = {
	successlog: message => {
		successlog.info(moment().format("YYYY-MM-DD HH:mm:ss") + " :: " + message);
	},
	errorlog: message => {
		errorlog.error(moment().format("YYYY-MM-DD HH:mm:ss") + " :: " + message);
	}
}