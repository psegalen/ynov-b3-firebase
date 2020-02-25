const userTokenCheck = async (admin, req, res) => {
  const authToken = req.get("FirebaseToken");

  if (!authToken || authToken.length === 0) {
    res.status(400).json({
      status: "error",
      error: "Pas de token d'authentification dans les headers !"
    });
    return null;
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
      return null;
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
      return null;
    }

    return uid;
  }
};

module.exports = userTokenCheck;
