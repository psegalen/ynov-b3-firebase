const userTokenCheck = require("./userTokenCheck");

const addMessage = async (admin, req, res) => {
  const message = req.body;

  console.log(message);

  const uid = await userTokenCheck(admin, req, res);

  if (!uid) return;

  if (!message.text || message.text.length === 0) {
    res
      .status(400)
      .json({ status: "error", error: "Le champ 'text' est obligatoire !" });
  } else if (!message.roomId || message.roomId.length === 0) {
    res
      .status(400)
      .json({ status: "error", error: "Le champ 'roomId' est obligatoire !" });
  } else {
    try {
      const room = await admin
        .firestore()
        .collection("rooms")
        .doc(message.roomId);
      if (!room) {
        res.status(400).json({
          status: "error",
          error: "La chat room n'existe pas !",
          details: error.message
        });
      } else {
        await room.update({
          messages: admin.firestore.FieldValue.arrayUnion({
            text: message.text,
            userId: uid,
            time: admin.firestore.Timestamp.now()
          })
        });
        res.json({
          status: "ok"
        });
      }
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: "Impossible d'ajouter le message !",
        details: error.message
      });
    }
  }
};

module.exports = addMessage;
