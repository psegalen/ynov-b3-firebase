const functions = require("firebase-functions");
const addMessage = require("./addMessage");
const getAllMessages = require("./getAllMessages");

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

exports.debug = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const token = req.get("FirebaseToken");
    if (!token || token.length === 0) {
      res.json({ status: "error", error: "Pas de token dans les headers !" });
    } else {
      try {
        console.log("Token reçu >>>>> ", token);
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        const user = await admin.auth().getUser(uid);
        res.send({ status: "ok", user: { uid, email: user.email } });
      } catch (error) {
        res.json({
          status: "error",
          error: "Impossible de décoder le token !",
          details: error.message
        });
      }
    }
  });
