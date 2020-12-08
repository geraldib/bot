const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const open = require('open');

const express = require('express');
const app = express();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

open("https://gchatbotal.herokuapp.com/");

app.get('/', function(req, res) {

    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        authorize(JSON.parse(content));
      });
      
      
      function authorize(credentials) {
      
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
      
      
        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) {
      
              const authUrl = oAuth2Client.generateAuthUrl({
                  access_type: 'offline',
                  scope: SCOPES,
                });
      
            open(authUrl);
            console.log(authUrl);
          }
      
          oAuth2Client.setCredentials(JSON.parse(token));
          console.log("Already created!!!");
      
        });
      }

      res.redirect('/auth_callback');

});  

app.get(`/auth_callback`, function (req, res) 
{

    oAuth2Client.getToken(req.params.code, (err, token) => {

        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);

        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
        });
        return res.send("Here");
        
    });

});


