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
      messages.push(Object.assign({}, doc.data(), { id: doc.id }));
    });
    res.json({ messages });
  });

exports.postMessage = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const message = req.body;
    if (!message.text || message.text.length === 0) {
      res.json({ status: "error", error: "Le champ 'text' est obligatoire !" });
    } else {
      if (!message.userId || message.userId.length === 0) {
        res.json({
          status: "error",
          error: "Le champ 'userId' est obligatoire !"
        });
      } else {
        // Message OK
        try {
          const user = await admin.auth().getUser(message.userId);
          // User exists
          try {
            await admin
              .firestore()
              .collection("messages")
              .add({
                text: message.text,
                userId: message.userId,
                time: admin.firestore.Timestamp.now()
              });
            res.json({
              status: "ok"
            });
          } catch (error) {
            res.json({
              status: "error",
              error: "Impossible d'ajouter le message !",
              details: error.message
            });
          }
        } catch (error) {
          // User doesn't exist
          res.json({
            status: "error",
            error: "L'utilisateur n'existe pas !",
            details: error.message
          });
        }
      }
    }
  });
