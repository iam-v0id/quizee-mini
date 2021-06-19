require( 'dotenv' ).config();

var express = require( 'express' );
var path = require( 'path' );
var cookieParser = require( 'cookie-parser' );
var logger = require( 'morgan' );
var session = require( 'express-session' );
var MongoStore = require( 'connect-mongo' );

var db = require( './dbconnect' );


var indexRouter = require( './routes/index' );
var usersRouter = require( './routes/users' );

var app = express();
db.connect();

app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( {extended: false} ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( session( {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create( {mongoUrl: process.env.MONGO_CONNECTION_STRING} )
} ) );

app.use( '/', indexRouter );
app.use( '/api', usersRouter );

module.exports = app;
