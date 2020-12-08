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

const credentials = fs.readFile('credentials.json');
      
const {client_secret, client_id, redirect_uris} = JSON.parse(credentials).web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);


app.get('/', function(req, res) {

    let tokenFile = fs.readFile(TOKEN_PATH);

    if(tokenFile instanceof Error) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        open(authUrl);
    } else {
        oAuth2Client.setCredentials(JSON.parse(token));
        res.redirect("Made it here!!");
    }

});  

app.get(`/auth_callback`, function (req, res) 
{

    const token = oAuth2Client.getToken(req.params.code);
    oAuth2Client.setCredentials(token);
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));

    return res.send("Token Created!");

});


