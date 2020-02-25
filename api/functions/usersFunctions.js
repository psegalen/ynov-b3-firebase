const userTokenCheck = require("./userTokenCheck");

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

  if (!body.roomId || body.roomId.length === 0) {
    res
      .status(400)
      .json({ status: "error", error: "Le champ 'roomId' est obligatoire !" });
  } else {
    try {
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: "Impossible d'ajouter le token !",
        details: error.message
      });
    }
  }
};

module.exports = { savePushToken, changeRoomSubscription };
