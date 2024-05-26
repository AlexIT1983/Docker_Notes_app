// делаем код для запуска на сервере для проекта на Node.js
// запустить терминал, в нем команду node index.js

require("dotenv").config();
const chalk = require("chalk");
const express = require("express"); // фреймворк express
const path = require("path");
const {
  addNote,
  getNotes,
  removeNote,
  updateNote,
} = require("./notes.controller");
const { addUser, loginUser } = require("./users.controller");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");

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
app.use(cookieParser());

// сервер через expess
// get запрос
app.get("/", async (req, res) => {
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    userEmail: req.user.email,
    created: false,
    error: false,
  });
});

// get запрос for login
app.get("/login", async (req, res) => {
  res.render("login", {
    title: "Express App",
    error: undefined,
  });
});

// post for login
app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");
  } catch (e) {
    res.render("login", {
      title: "Express App",
      error: e.message,
    });
  }
});

// registration
app.get("/register", async (req, res) => {
  res.render("register", {
    title: "Express App",
    error: undefined,
  });
});

// registration обработчик.
app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);
    res.redirect("/login");
  } catch (e) {
    if (e.code === 11000) {
      res.render("register", {
        title: "Express App",
        error: "Email is already registered",
      });
      return;
    }

    console.error("Creation error", e);
    res.render("register", {
      title: "Express App",
      error: e.message,
    });
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true });

  res.redirect("/login");
});

app.use(auth);

// post запрос
app.post("/", async (req, res) => {
  try {
    await addNote(req.body.title, req.user.email);
    // console.log("Request", req.body);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: false,
    });
  } catch (err) {
    console.error("Creation error", err);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: true,
    });
  }
});

// добавляем возможность удаления
app.delete("/:id", async (req, res) => {
  // console.log("Id", req.params.id);
  try {
    await removeNote(req.params.id, req.user.email);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

// добавить возможность редактирования
app.put("/:id", async (req, res) => {
  try {
    await updateNote(
      { id: req.params.id, title: req.params.title },
      req.user.email
    );
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

// подключение mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
  app.listen(port, () => {
    console.log(chalk.green(`Server has been started on port ${port} ... `));
  });
});
