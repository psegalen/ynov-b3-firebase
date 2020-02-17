const functions = require("firebase-functions");
const addMessage = require("./addMessage");
const getAllMessages = require("./getAllMessages");

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.getMessages = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(getAllMessages(admin));

exports.postMessage = functions
  .region("europe-west1")
  .https.onRequest(addMessage(admin));
