const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.getMessages = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    const querySnapshot = await admin
      .firestore()
      .collection("messages")
      .orderBy("time", "desc")
      .get();
    const messages = [];
    querySnapshot.forEach(doc => {
      messages.push(doc.data());
    });
    res.json({ messages });
  });
