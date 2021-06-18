var express = require( 'express' );
var router = express.Router();

/* GET home page. */
router.get( '/home', function ( req, res )
{
  let filepath = __dirname + "/public/index.html";
  res.sendFile( filepath );
} );


module.exports = router;
