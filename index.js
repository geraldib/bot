const fs = require('fs');
const {google} = require('googleapis');
const open = require('open');


const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
});



// function authorize(credentials) {

//   const {client_secret, client_id, redirect_uris} = credentials.web;

//   const oAuth2Client = new google.auth.OAuth2( client_id, client_secret, redirect_uris[0]);

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {


//       const authUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: SCOPES,
//       });

//       open(authUrl);

//       const token = await oauth2Client.getToken(code);
      
//       oauth2Client.setCredentials(token);

//       callback(oAuth2Client);
//   })
// }

// 4/0AY0e-g4gj6zqhy960d7DS3sCBW0u0vNBJAR2TxETK_t4fSRYDqA0fBSZ9sdzruyAbtm9UA
const  authorize =  (credentials, callback) => {

  const {client_secret, client_id, redirect_uris} = credentials.web;


  const oAuth2Client = new google.auth.OAuth2( client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, async (err, token) => {
    if (err) {
        const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });

      open(authUrl);
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