var express = require( 'express' );
var router = express.Router();
const {login, logout, register} = require( '../bin/Backend/lib/user' );
const {body, validationResult, check} = require( 'express-validator' );

/* GET users listing. */
// 
let password_regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-\?;,./{}|\":<>\[\]\\\' ~_]).{8,}/;
router.post( '/user/register', body( 'firstname' ).isLength( {min: 1} ).withMessage( 'firstname cannot be empty' ), body( 'lastname' ).isLength( {min: 1} ).withMessage( 'lastname cannot be empty' ), body( 'email' ).isEmail().withMessage( "Invalid Email" ), check( 'password' ).matches( password_regex ).withMessage( "Invalid Password" ), register );
router.post( '/user/login', login );
router.post( '/user/logout', logout );

module.exports = router;

