// отдельный файл для нашей программы и реализации ее логики.
const fs = require("fs/promises"); // подключаем модуль fs
const path = require("path"); // подключаем модуль path
const chalk = require("chalk"); // подключаем модуль chalk

const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNotes();
  // console.log(notes);

  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await saveNotes(notes);
  console.log(chalk.bgGreen("Note was added"));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

// сделаем отедльную функцию для печати списка
async function printNotes() {
  const notes = await getNotes();
  console.log(chalk.bgBlue("Here is the list of notes: "));
  notes.forEach((note) => {
    console.log(chalk.bgGreen("ID", note.id), chalk.blue(note.title));
  });
}

// функция для сохранения элемента
async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes));
}

//функция для обновления заметки
async function updateNote(noteData) {
  const notes = await getNotes();
  // ищем id заметки
  const index = notes.findIndex((note) => note.id === noteData.id);
  if (index >= 0) {
    notes[index] = { ...notes[index], ...noteData };
    await saveNotes(notes);
    console.log(chalk.bgBlue(`Note with id="${noteData.id}" has been updated`));
  }
}

// функция для удаления элемента
async function removeNote(id) {
  const notes = await getNotes();
  const filterNotes = notes.filter((note) => note.id !== id);

  await saveNotes(filterNotes);
  console.log(chalk.red(`Delete note with id="${id}" has completed`));
}

module.exports = {
  addNote,
  printNotes,
  removeNote,
  getNotes,
  updateNote,
};
