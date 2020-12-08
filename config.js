const port = 3000;
const baseURL = 'https://gchatbotal.herokuapp.com';

module.exports = {
  // The secret for the encryption of the jsonwebtoken
  JWTsecret: 'geraldib',
  baseURL: baseURL,
  port: port,

  // The credentials and information for OAuth2
  oauth2Credentials: {
    client_id: "298266977754-iqqav3v9k5jn786uhs70mkn6n5ud5bb2.apps.googleusercontent.com",
    project_id: "botchat-1607446574171", // The name of your project
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "-RVJabaSSQqKgTWns9M1bD_Q",
    redirect_uris: [
        `${baseURL}/auth_callback`
    ],
    scopes: [
      'https://www.googleapis.com/auth/drive'
    ]
  }
};