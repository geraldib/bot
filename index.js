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
    text = `Thanks for adding me to the AAAA ${req.body.space.displayName}`;

    // var fileMetadata = {
    //     'name': 'Invoices',
    //     'mimeType': 'application/vnd.google-apps.folder'
    //   };
    //   drive.files.create({
    //     resource: fileMetadata,
    //     fields: 'id'
    //   }, function (err, file) {
    //     if (err) {
    //       // Handle error
    //       console.error(err);
    //     } else {
    //       console.log('Folder Id: ', file.id);
    //     }
    // });

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