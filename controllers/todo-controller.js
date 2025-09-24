const prisma = require("../models/prisma");

exports.createTodo = async (req, res, next) => {
  try {
    res.status(201).json({ message: "created" });
  } catch (err) {
    next(err);
  }
};
