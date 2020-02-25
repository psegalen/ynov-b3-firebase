const chatRoomCheck = async (admin, res, roomId) => {
  if (!roomId || roomId.length === 0) {
    res
      .status(400)
      .json({ status: "error", error: "Le champ 'roomId' est obligatoire !" });
    return null;
  } else {
    try {
      const roomRef = admin
        .firestore()
        .collection("rooms")
        .doc(roomId);
      const room = await roomRef.get();
      if (!room.exists) {
        res.status(400).json({
          status: "error",
          error: "La chat room n'existe pas !"
        });
        return null;
      } else {
        return { roomRef, room: room.data() };
      }
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: "Impossible de récupérer la chat room !",
        details: error.message
      });
      return null;
    }
  }
};

module.exports = chatRoomCheck;
