const addMessage = async (admin, req, res) => {
  const message = req.body;
  const token = req.get("FirebaseToken");

  if (!token || token.length === 0) {
    res
      .status(400)
      .json({ status: "error", error: "Pas de token dans les headers !" });
  } else if (!message.text || message.text.length === 0) {
    res
      .status(400)
      .json({ status: "error", error: "Le champ 'text' est obligatoire !" });
  } else {
    // Message OK
    let uid = "";
    try {
      console.log("Token reçu >>>>> ", token);
      const decodedToken = await admin.auth().verifyIdToken(token);
      uid = decodedToken.uid;
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: "Impossible de décoder le token !",
        details: error.message
      });
    }

    try {
      const user = await admin.auth().getUser(uid);
      // User exists
    } catch (error) {
      // User doesn't exist
      res.status(400).json({
        status: "error",
        error: "L'utilisateur n'existe pas !",
        details: error.message
      });
    }

    try {
      await admin
        .firestore()
        .collection("messages")
        .add({
          text: message.text,
          userId: uid,
          time: admin.firestore.Timestamp.now()
        });
      res.json({
        status: "ok"
      });
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