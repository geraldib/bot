const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const fs = require('fs');
const {google} = require('googleapis');
const open = require('open');

app.listen(PORT, () => {
  console.log(`Server is running in port - ${PORT}`);
});

const theCode = app.get('/', (req, res) => {
  
  return JSON.stringify(req.query.code);

});


const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';


fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
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

      oAuth2Client.getToken(theCode, (err,token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);

        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        return callback(oAuth2Client);

      });

    } 

      oAuth2Client.setCredentials(JSON.parse(token));
      return callback(oAuth2Client);

  });


}

app.post('/', (req, res) => {
  let text = '';
  // Case 1: When BOT was added to the ROOM
  if (req.body.type === 'ADDED_TO_SPACE' && req.body.space.type === 'ROOM') {
    text = `Thanks for adding me to ${req.body.space.displayName}`;
  // Case 2: When BOT was added to a DM
  } else if (req.body.type === 'ADDED_TO_SPACE' &&
      req.body.space.type === 'DM') {
    text = `Thanks for adding me to a DM, ${req.body.user.displayName}`;
  // Case 3: Texting the BOT
  } else if (req.body.type === 'MESSAGE') {
    text = `Your message : ${req.body.message.text}`;
  }
  return res.json({text});
});

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