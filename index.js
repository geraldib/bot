const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const drive = google.drive(
    {version: 'v3', auth: 'AIzaSyBg_gizkcJNK5Gj-48KdpqrAifckoLWE1Y'
});

drive.files.create({
    resource: fileMetadata,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('Folder Id: ', file.id);
    }
  });