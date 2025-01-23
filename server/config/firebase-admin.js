const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your service account
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
