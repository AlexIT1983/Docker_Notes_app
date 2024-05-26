// Middleware для логина

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constans");

function auth(req, res, next) {
  const token = req.cookies.token;

  try {
    const veryfyResult = jwt.verify(token, JWT_SECRET);

    req.user = {
      email: veryfyResult.email,
    };

    next();
  } catch (e) {
    res.redirect("/login");
  }
}

module.exports = {
  auth,
};
