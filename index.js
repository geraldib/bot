const express = require('express');
const google = require('googleapis').google;
const fs = require('fs');
const jwt = require('jsonwebtoken');
// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;
// Including our config file
const CONFIG = require('./config');
// Creating our express application
const app = express();
// Allowing ourselves to use cookies
const cookieParser = require('cookie-parser');
const { testing } = require('googleapis/build/src/apis/testing');

const TOKEN_PATH = 'token.json';

const PORT = process.env.PORT || 9000;

app.use(cookieParser());
// Setting up EJS Views
app.set('view engine', 'ejs');
app.set('views', __dirname);
// Listen on the port defined in the config file

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

app.get(`/`, function (req, res) {

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

app.get(`/auth_callback`, function (req, res) {
    // Create an OAuth2 client object from the credentials in our config file
    const oauth2Client = new OAuth2(
        CONFIG.oauth2Credentials.client_id, 
        CONFIG.oauth2Credentials.client_secret, 
        CONFIG.oauth2Credentials.redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {

        if (err) {
            oauth2Client.getToken(req.query.code, (err, token) => {
                if (err) return res.send(err);
                oauth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                  if (err) return res.send(err);
                  return res.send("Token was stored!");
                });
                listFiles(oauth2Client);
            });
        }

        oauth2Client.setCredentials(JSON.parse(token));
        listFiles(oauth2Client);

    });



});

/**
 * Lists the names and IDs of up to 10 files.
 */
function listFiles(auth) {
    const drive = google.drive({version: 'v3', auth});
    return res.send('It worked!!!');
}

  