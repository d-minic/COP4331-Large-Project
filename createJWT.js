const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.createToken = function ( id, fn, ln, email, points, friends, isVerified, error)
{
    return _createToken( id, fn, ln, email, points, friends, isVerified, error);
}

_createToken = function ( id, fn, ln, email, points, friends, isVerified, error)
{
    try
    {
        const expiration = new Date();
        const user = {id:id, firstName:fn, lastName:ln, email:email, points:points, friends:friends, isVerified:isVerified, error:error};
        const accessToken = jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);
        // In order to expire with a value other than the default, use the
        // following
        /*
        const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,
        Step 1 to implement JWTs in the cards application.
        install jsonwebtoken and jwt-decode
        Add ACCESS_TOKEN_SECRET to .env
        Add the createJWT.js file
        Edit the login api endpoint so that it creates a JWT with relevant
        information and returns it.
        const token = require("./createJWT.js");
        ret = token.createToken( fn, ln, id );
        { expiresIn: '30m'} );
        '24h'
        '365d'
        */
        var ret = {accessToken:accessToken};
    }
    catch(e)
    {
        var ret = {error:e.message};
    }
    return ret;
}
exports.isExpired = function( token )
{
    var isError = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET,
    (err, verifiedJwt) =>
    {
        if( err )
        {
            return true;
        }
        else
        {
            return false;
        }
    });
    return isError;
}
exports.refresh = function( token )
{
    var ud = jwt.decode(token,{complete:true});
    var id = ud.payload.id;
    var firstName = ud.payload.firstName;
    var lastName = ud.payload.lastName;
    var email = ud.payload.email;
    var points = ud.payload.points;
    var friends = ud.payload.friends;
    var isVerified = ud.payload.isVerified;
    var error = ud.payload.error;
    return _createToken( id, firstName, lastName, email, points, friends, isVerified, error);
}