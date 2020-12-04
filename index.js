const express = require('express');
const PORT = process.env.PORT || 5000;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const app = express()
    .use(express.urlencoded({extended: false}))
    .use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running in port - ${PORT}`);
});    
 
app.get('/', (req, res) => {
    res.send('Hi');
});

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), listFiles);
});

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
    });
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
    });
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

app.post('/', (req, res) => {

  let text = '';

  // Case 1: When BOT was added to the ROOM
  if (req.body.type === 'ADDED_TO_SPACE' && req.body.space.type === 'ROOM') {
    text = `Thanks for adding me to the AAAA ${req.body.space.displayName}`;

//   Case 2: When BOT was added to a DM
  } else if (req.body.type === 'ADDED_TO_SPACE' &&
      req.body.space.type === 'DM') {
    text = `Thanks for adding me to a DM, ${req.body.user.displayName}`;

  // Case 3: Texting the BOT
  } else if (req.body.type === 'MESSAGE') {
    text = `Your message was : ${req.body.message.text}`;

  }

  return res.json({text});

});


