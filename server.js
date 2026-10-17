const http = require("node:http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (req.method === "GET" && req.url === "/tasks") {
    res.writeHead(200);
    res.end(
      JSON.stringify([
        { id: 1, title: "Learn CI/CD", completed: false }
      ])
    );
    return;
  }

  if (req.method === "GET" && req.url === "/version") {
    res.writeHead(200);
    res.end(JSON.stringify({ version: "3.0.0" }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route not found" }));
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = server;