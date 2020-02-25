const savePushToken = async (admin, req, res) => {
  const { body } = req;
  const authToken = req.get("FirebaseToken");

  console.log(body);

  if (!authToken || authToken.length === 0) {
    res.status(400).json({
      status: "error",
      error: "Pas de token d'authentification dans les headers !"
    });
  } else if (!body.token || body.token.length === 0) {
    res
      .status(400)
      .json({ status: "error", error: "Le champ 'token' est obligatoire !" });
  } else {
    // Token OK
    let uid = "";
    try {
      console.log("Token reçu >>>>> ", authToken);
      const decodedToken = await admin.auth().verifyIdToken(authToken);
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
  }
};

module.exports = { savePushToken };
