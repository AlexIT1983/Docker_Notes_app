// Пример создания сервера на Node.js

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    const content = await fs.readFile(path.join(basePath, "index.html"));
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(content);
  } else if (req.method === "POST") {
    const body = []; // массив для буфера
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    req.on("data", (data) => {
      body.push(Buffer.from(data));
      // console.log("data", data);
    });

    req.on("end", () => {
      const title = body.toString().split("=")[1].replaceAll("+", " ");
      addNote(title);

      res.end(`Title = ${title}`);
    });
  }
});
