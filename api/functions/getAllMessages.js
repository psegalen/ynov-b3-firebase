const getAllMessages = async (admin, res) => {
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
};

module.exports = getAllMessages;
