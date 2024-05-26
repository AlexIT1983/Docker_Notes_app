// Схема для регистрации пользователей.
const mongoose = require("mongoose");
const validator = require("validator");

// схема
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid email",
    },
  },
  password: {
    type: String,
    required: true,
  },
});

// создадим модель

const User = mongoose.model("User", UserSchema);

// экспортируем модель
module.exports = User;
