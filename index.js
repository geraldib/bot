const express = require('express');
const google = require('googleapis').google;
const jwt = require('jsonwebtoken');
// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;
// Including our config file
const CONFIG = require('./config');
// Creating our express application
const app = express();
// Allowing ourselves to use cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Setting up EJS Views
app.set('view engine', 'ejs');
app.set('views', __dirname);
// Listen on the port defined in the config file

app.listen(CONFIG.port, function () {
  console.log(`Listening on port ${CONFIG.port}`);
});

app.get('/', function (req, res) {

    // Create an OAuth2 client object from the credentials in our config file
    const oauth2Client = new OAuth2(
        CONFIG.oauth2Credentials.client_id, 
        CONFIG.oauth2Credentials.client_secret, 
        CONFIG.oauth2Credentials.redirect_uris[0]
    );

    // Obtain the google login link to which we'll send our users to give us access
    const loginLink = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: CONFIG.oauth2Credentials.scopes
    });

    return res.render("index", { loginLink: loginLink });

});

app.get('/auth_callback', function (req, res) {
    // Create an OAuth2 client object from the credentials in our config file
    const oauth2Client = new OAuth2(
        CONFIG.oauth2Credentials.client_id, 
        CONFIG.oauth2Credentials.client_secret, 
        CONFIG.oauth2Credentials.redirect_uris[0]
    );
    if (req.query.error) {
      // The user did not give us permission.
      return res.redirect('/');
    } else {
      oauth2Client.getToken(req.query.code, function(err, token) {
        if (err)
          return res.redirect('/');
  
        // Store the credentials given by google into a jsonwebtoken in a cookie called 'jwt'
        res.cookie('jwt', jwt.sign(token, CONFIG.JWTsecret));
        return res.redirect('/');
      });
    }
  });