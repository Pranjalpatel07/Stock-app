const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "jwtSecretVeryConfidential";

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("Unauthorized");

    const verified = jwt.verify(token, JWT_SECRET);
    if (!verified) {
      res.clearCookie("token");
      return res.status(401).send("Unauthorized");
    }
    req.user = verified;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.clearCookie("token");
      return res.status(401).send("Unauthorized");
    }
    res.status(500).send("Internal Server Error");
  }
};

module.exports = auth;
