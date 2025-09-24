const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    // if the client does not send authorization headers, authorization will be undefined
    console.log(authorization);
    if (!authorization)
      return res.status(401).json({ message: "unauthenticated" });
    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ message: "unauthenticated" });
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "very_secret"
    );

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) return res.status(401).json({ message: "unauthenticated" });
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
