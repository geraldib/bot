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

    oauth2Client.getToken(req.query.code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oauth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        listFiles(oauth2Client);
    });

});

/**
 * Lists the names and IDs of up to 10 files.
 */
function listFiles(auth) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {

        if (err) return console.log('The API returned an error: ' + err);

        const files = res.data.files;

        files.map((file) => {
            return res.render("index", { loginLink: file });
        });

    });
}

  