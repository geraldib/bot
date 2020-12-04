const express = require('express');
const PORT = process.env.PORT || 5000;
const {google} = require('googleapis');

const drive = 'https://www.googleapis.com/upload/drive/v3/files';

const app = express()
    .use(express.urlencoded({extended: false}))
    .use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running in port - ${PORT}`);
});    
 
app.get('/', (req, res) => {
    res.send('Hi');
});

app.post('/', (req, res) => {

  let text = '';

  // Case 1: When BOT was added to the ROOM
  if (req.body.type === 'ADDED_TO_SPACE' && req.body.space.type === 'ROOM') {
    text = `Thanks for adding me to ${req.body.space.displayName}`;

      const fileMetadata = {
        'name': `${req.body.space.displayName}`,
        'mimeType': 'application/vnd.google-apps.folder'
      };

      drive.files.create({
        resource: fileMetadata,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
            console.log("Created Ok");
        }
      });

    text = `Folder: "${req.body.space.displayName}" was created!`;

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



