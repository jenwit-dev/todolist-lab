const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    // const result = await prisma.user.create({
    //   data: { username, email, password: hashedPassword },
    // });
    await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    // console.log(`result : ${result}`);
    // console.log(JSON.stringify(result, null, 2));
    res.status(201).json({ message: "success" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const targetUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!targetUser) {
      return res.status(400).json({ message: "invalid credential" });
    }

    const isMatch = await bcrypt.compare(password, targetUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "invalid credential" });
    }

    const payload = { id: targetUser.id };
    // const secretKey = "qwerty";
    // it's better to create JWT_SECRET_KEY in file .env since JWT_SECRET_KEY may change depending on each environment, for example, JWT_SECRET_KEY in development stage, JWT_SECRET_KEY in test stage, and JWT_SECRET_KEY in production stage
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "secret",
      {
        expiresIn: process.env.JWT_EXPIRE || "1",
      }
    );
    // console.log(accessToken);
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};
