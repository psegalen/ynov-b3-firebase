const functions = require("firebase-functions");
const addMessage = require("./addMessage");
const getAllMessages = require("./getAllMessages");
const usersFunctions = require("./usersFunctions");

// CORS Express middleware to enable CORS Requests.
const cors = require("cors")({
  origin: true
});

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.getMessages = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await getAllMessages(admin, res);
    });
  });

exports.postMessage = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await addMessage(admin, req, res);
    });
  });

exports.getRooms = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      const querySnapshot = await admin
        .firestore()
        .collection("rooms")
        .orderBy("name", "asc")
        .get();
      const rooms = [];
      querySnapshot.forEach(doc => {
        rooms.push({
          id: doc.id,
          name: doc.data().name,
          nbMessages: doc.data().messages.length
        });
      });
      res.json({ rooms });
    });
  });

exports.setToken = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await usersFunctions.savePushToken(admin, req, res);
    });
  });
