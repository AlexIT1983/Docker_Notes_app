// делаем код для запуска на сервере для проекта на Node.js
// запустить терминал, в нем команду node index.js

const chalk = require("chalk");
const express = require("express"); // фреймвор express
const path = require("path");
const {
  addNote,
  getNotes,
  removeNote,
  updateNote,
} = require("./notes.controller");

const port = 3000; // задаем порт для работы хоста

// создаем app для работы express
const app = express();

// установим шаблонизатор ejs
app.set("view engine", "ejs");
// зададим views к папке pages
app.set("views", "pages");

// сделаем папку public статической
app.use(express.static(path.resolve(__dirname, "public")));

// encoded for express
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// сервер через expess
// get запрос
app.get("/", async (req, res) => {
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});
// post запрос
app.post("/", async (req, res) => {
  await addNote(req.body.title);
  // console.log("Request", req.body);
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: true,
  });
});

// добавляем возможность удаления
app.delete("/:id", async (req, res) => {
  // console.log("Id", req.params.id);
  await removeNote(req.params.id);
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});

// добавить возможность редактирования
app.put("/:id", async (req, res) => {
  await updateNote({ id: req.params.id, title: req.params.title });
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});

app.listen(port, () => {
  console.log(chalk.green(`Server has been started on port ${port} ... `));
});
