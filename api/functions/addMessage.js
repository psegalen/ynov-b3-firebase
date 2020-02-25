const userTokenCheck = require("./userTokenCheck");
const chatRoomCheck = require("./chatRoomCheck");

const addMessage = async (admin, req, res) => {
  const message = req.body;

  console.log(message);

  const uid = await userTokenCheck(admin, req, res);

  if (!uid) return;

  if (!message.text || message.text.length === 0) {
    res
      .status(400)
      .json({ status: "error", error: "Le champ 'text' est obligatoire !" });
  } else {
    const result = await chatRoomCheck(admin, res, message.roomId);
    if (result) {
      const { roomRef } = result;
      try {
        await roomRef.update({
          messages: admin.firestore.FieldValue.arrayUnion({
            text: message.text,
            userId: uid,
            time: admin.firestore.Timestamp.now()
          })
        });
        res.json({
          status: "ok"
        });
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

module.exports = addMessage;
