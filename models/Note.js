// Схема данных для БД

const mongoose = require("mongoose");

// схема
const NoteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

// создадим модель

const Note = mongoose.model("Note", NoteSchema);

// экспортируем модель
module.exports = Note;
