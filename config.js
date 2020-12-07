const port = 3000;
const baseURL = 'https://gchatbotal.herokuapp.com';

module.exports = {
  // The secret for the encryption of the jsonwebtoken
  JWTsecret: 'geraldib',
  baseURL: baseURL,
  port: port,

  // The credentials and information for OAuth2
  oauth2Credentials: {
    client_id: "512739329088-je70lfi9587ajq31gt5lepmvl0d6e868.apps.googleusercontent.com",
    project_id: "quickstart-1607330313069", // The name of your project
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "UXtWJst8JNrfINCAL0t132X_",
    redirect_uris: [
        `${baseURL}/auth_callback`
    ],
    scopes: [
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ]
  }
};