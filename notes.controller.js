// отдельный файл для нашей программы и реализации ее логики.

const chalk = require("chalk"); // подключаем модуль chalk
const Note = require("./models/Note"); // подключаем модель

// добавление заметки
async function addNote(title, owner) {
  await Note.create({ title, owner });
  console.log(chalk.bgGreen("Note was added"));
}

// получение заметок
async function getNotes() {
  const notes = await Note.find();
  return notes;
}

//функция для обновления заметки
async function updateNote(noteData, owner) {
  const result = await Note.updateOne(
    { _id: noteData.id, owner },
    { title: noteData.title }
  );

  if (result.matchedCount === 0) {
    throw new Error("No note to edit");
  }
  console.log(chalk.bgBlue(`Note with id="${noteData.id}" has been updated`));
}

// функция для удаления элемента
async function removeNote(id, owner) {
  const result = await Note.deleteOne({ _id: id, owner });

  if (result.matchedCount === 0) {
    throw new Error("No note to delete");
  }

  console.log(chalk.red(`Delete note with id="${id}" has completed`));
}

module.exports = {
  addNote,
  removeNote,
  getNotes,
  updateNote,
  registerUser,
};
