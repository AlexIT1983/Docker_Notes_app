// отдельный файл для регистрации пользователя, нашей программы и реализации ее логики.

const chalk = require("chalk"); // подключаем модуль chalk
const User = require("./models/User"); // подключаем модель User
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./constans");

// функция для регистрации пользователя
async function addUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, password: passwordHash });
  console.log(chalk.bgBlue(`User with email="${email}" has been created`));
}

// функция для логина
async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Wrong password");
  }

  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "30d" });
}

module.exports = {
  addUser,
  loginUser,
};
