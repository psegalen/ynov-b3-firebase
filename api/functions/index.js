const functions = require("firebase-functions");
const axios = require("axios");
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

exports.changeRoomSubscription = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await usersFunctions.changeRoomSubscription(admin, req, res);
    });
  });

exports.sendPushOnNewMessage = functions
  .region("europe-west1")
  .firestore.document("rooms/{roomId}")
  .onWrite(async (change, context) => {
    const { roomId } = context.params;
    console.log(roomId);
    const { messages, subscribedUsers, name } = change.after.data();
    const latestMessage = messages[messages.length - 1];
    console.log(latestMessage);
    console.log(subscribedUsers);

    subscribedUsers.forEach(async userId => {
      // Get token and send a push notification
      const userRef = admin
        .firestore()
        .collection("users")
        .doc(userId);
      const user = await userRef.get();
      if (user.exists) {
        const { token } = user.data();
        if (token) {
          try {
            await axios.post("https://exp.host/--/api/v2/push/send", {
              to: token,
              sound: "default",
              title: `Nouveau message dans ${name} !`,
              body: latestMessage.text
            });
          } catch (error) {
            console.error(
              `L'appel réseau n'a pas fonctionné : ${error.message}`
            );
          }
        }
      }
    });
    return "Done";
  });
