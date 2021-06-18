var mongoose = require( 'mongoose' );
var connection_string = process.env.MONGO_CONNECTION_STRING;
module.exports.connect = function ()
{
    console.log( "Trying to connect to MongoDB " );
    var dbOptions = {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, auto_reconnect: true};
    mongoose.connect( connection_string, dbOptions );

    var db = mongoose.connection;
    db.on( 'connecting', function ()
    {
        console.log( 'connecting to MongoDB...' );
    } );

    db.on( 'error', function ( error )
    {
        console.error( 'Error in MongoDb connection: ' + error );
        mongoose.disconnect();
    } );


    db.on( 'connected', function ()
    {
        console.log( 'MongoDB connected!' );
    } );

    db.once( 'open', function ()
    {
        console.log( 'MongoDB connection opened!' );
    } );

    db.on( 'reconnected', function ()
    {
        console.log( 'MongoDB reconnected!' );
    } );


    db.on( 'disconnected', function ()
    {
        console.log( 'MongoDB disconnected!' );
        mongoose.connect( connection_string, dbOptions );
    } );
}


module.exports.disconnect = function ()
{
    mongoose.disconnect();
}