module.exports = (req, res, next) => {
  // test error middleware
  // throw new Error("Test error middleware");
  res.status(404).json({ message: "resource not found on this server" });
};
