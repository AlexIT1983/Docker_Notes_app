// делаем код для запуска на сервере для проекта на Node.js
// запустить терминал, в нем команду node index.js

// подключаем пакет yargs в наш проект
const yargs = require("yargs");
const pkg = require("./package.json");
const { addNote, printNotes, removeNote } = require("./notes.controller");

yargs.version(pkg.version);

// вызываем метод command у объекта yargs
yargs.command({
  command: "add",
  describe: "Add new note to list",
  builder: {
    title: {
      type: "string",
      describe: "Note title",
      demandOption: true,
    },
  },
  handler({ title }) {
    addNote(title);
  },
});
// еще одна комманда для вывода списка объекта
yargs.command({
  command: "list",
  describe: "Print all notes",
  async handler() {
    await printNotes();
  },
});

// еще одна комманда для удаления заметки
yargs.command({
  command: "remove",
  describe: "Remove note by id",
  builder: {
    id: {
      type: "string",
      describe: "Note id",
      demandOption: true,
    },
  },

  async handler({ id }) {
    await removeNote(id);
  },
});

// для инициализации наших новых комманд, чтобы они работали надо вызывать метод parse
yargs.parse();
