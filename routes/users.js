var express = require( 'express' );
var router = express.Router();
var userLib = require( '../bin/Backend/lib/user' );
/* GET users listing. */
router.post( '/user/register', userLib.register );
router.post( '/user/login', userLib.login );

module.exports = router;
