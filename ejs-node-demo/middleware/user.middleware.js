const jwt = require("jsonwebtoken");
const session = require('express-session');

const isLoggedIn = async (req, res, next) => {
  try {
      if(req.session.loggedin){
          var token = req.session.token;
          // const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token,'secret'); 
          req.session.userData = decoded;
          res.locals.user = req.session.userData.data;
          next();    
      } else {
         res.redirect('/');
         // next(); 
      }
     
  } catch (err) {
    res.redirect('/');
      // return res.status(401).send({
      //     status:401,
      //     message: 'Your session is not valid!' 
      // });
  }
}

module.exports = { isLoggedIn }