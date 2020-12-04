const express = require('express');
const PORT = process.env.PORT || 5000;
const {google} = require('googleapis');

const app = express()
    .use(express.urlencoded({extended: false}))
    .use(express.json());

app.get('/', (req, res) => {
    res.send('Hi');
});

app.post('/', (req, res) => {

  let text = '';

  // Case 1: When BOT was added to the ROOM
  if (req.body.type === 'ADDED_TO_SPACE' && req.body.space.type === 'ROOM') {
    text = `Thanks for adding me to ${req.body.space.displayName}`;

    var fileMetadata = {
        'name': req.body.space.displayName,
        'mimeType': 'application/vnd.google-apps.folder'
      };
      drive.files.create({
        resource: fileMetadata,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
            text = `Folder was not created!!!`;
        } else {
            text = `Folder: "${req.body.space.displayName}" with ID: "${file}" was created!`;
        }
      });

  // Case 2: When BOT was added to a DM
  } else if (req.body.type === 'ADDED_TO_SPACE' &&
      req.body.space.type === 'DM') {
    text = `Thanks for adding me to a DM, ${req.body.user.displayName}`;

  // Case 3: Texting the BOT
  } else if (req.body.type === 'MESSAGE') {
    text = `Your message hhdhdhdhdhdh : ${req.body.message.text}`;
  }

  return res.json({text});

});

app.listen(PORT, () => {
  console.log(`Server is running in port - ${PORT}`);
});