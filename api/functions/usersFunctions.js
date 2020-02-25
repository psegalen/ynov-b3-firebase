const userTokenCheck = require("./userTokenCheck");
const chatRoomCheck = require("./chatRoomCheck");

const savePushToken = async (admin, req, res) => {
  const { body } = req;

  console.log(body);

  const uid = await userTokenCheck(admin, req, res);

  if (!uid) return;

  try {
    const user = await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .get();
    if (user.exists) {
      await user.update({ token: body.token });
    } else {
      await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .set({ token: body.token });
    }
    res.json({
      status: "ok"
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: "Impossible d'ajouter le token !",
      details: error.message
    });
  }
};

const changeRoomSubscription = async (admin, req, res) => {
  const { body } = req;

  console.log(body);

  const uid = await userTokenCheck(admin, req, res);

  if (!uid) return;

  if (
    !body.action ||
    body.action.length === 0 ||
    (body.action != "subscribe" && body.action != "unsubscribe")
  ) {
    res.status(400).json({
      status: "error",
      error:
        "Le champ 'action' est obligatoire et doit contenir 'subscribe' ou 'unsubscribe' !"
    });
  } else {
    const result = await chatRoomCheck(admin, res, body.roomId);
    if (result) {
      try {
        const { subscribedUsers } = result.room;
        let isActionCorrect = true;
        if (
          body.action == "subscribe" &&
          subscribedUsers &&
          subscribedUsers.indexOf(uid) !== -1
        ) {
          res.status(400).json({
            status: "error",
            error: "L'utilisateur a déjà souscrit à cette chat room !"
          });
          isActionCorrect = false;
        }
        if (
          body.action == "unsubscribe" &&
          (!subscribedUsers || subscribedUsers.indexOf(uid) === -1)
        ) {
          res.status(400).json({
            status: "error",
            error:
              "L'utilisateur n'a pas souscrit à cette chat room au préalable !"
          });
          isActionCorrect = false;
        }
        if (isActionCorrect) {
          if (body.action == "subscribe") {
            if (!subscribedUsers) {
              await result.roomRef.update({
                subscribedUsers: [uid]
              });
            } else {
              await result.roomRef.update({
                subscribedUsers: admin.firestore.FieldValue.arrayUnion(uid)
              });
            }
          } else {
            await result.roomRef.update({
              subscribedUsers: admin.firestore.FieldValue.arrayRemove(uid)
            });
          }
          res.json({
            status: "ok"
          });
        }
      } catch (error) {
        res.status(400).json({
          status: "error",
          error: "Impossible de mettre à jour la chat room !",
          details: error.message
        });
      }
    }
  }
};

module.exports = { savePushToken, changeRoomSubscription };
