const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const fs = require('fs');
const {google} = require('googleapis');
const open = require('open');


app.listen(PORT, () => {
  return console.log("hi");
});

app.get("/", (req, res) => {
  return console.log("Hellow Get");
});

app.get('/:code/:scope', function (req, res) {
  return console.log("The Code is here");
})


const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
});


const  authorize =  (credentials, callback) => {

  const {client_secret, client_id, redirect_uris} = credentials.web;


  const oAuth2Client = new google.auth.OAuth2( client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, async (err, token) => {
    if (err) {
        const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });

      open(authUrl, {app: ['google chrome']});
      code = "dasdas";

      oAuth2Client.getToken(code, (err,toke) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);

        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);

      });



    } else {
      oAuth2Client.setCredentials(JSON.parse(token));
    }

   
    callback(oAuth2Client);
  });


}

function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}