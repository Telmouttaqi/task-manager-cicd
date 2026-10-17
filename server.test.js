const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const server = require("./server");

let baseUrl;

// Start the server before running tests.
before(async () => {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
});

// Stop the server after the tests finish.
after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

test("GET /health returns status ok", async () => {
  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/json/);
  assert.deepEqual(body, { status: "ok" });
});

test("GET /tasks returns the sample task", async () => {
  const response = await fetch(`${baseUrl}/tasks`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/json/);
  assert.deepEqual(body, [
    { id: 1, title: "Learn CI/CD", completed: false }
  ]);
});

test("GET /version returns the server version", async () => {
  const response = await fetch(`${baseUrl}/version`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/json/);
  assert.deepEqual(body, { version: "3.0.0" });
});

test("GET /unknown returns 404", async () => {
  const response = await fetch(`${baseUrl}/unknown`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type"), /application\/json/);
  assert.deepEqual(body, { error: "Route not found" });
});

test("non-GET requests to known routes return 404", async () => {
  const response = await fetch(`${baseUrl}/health`, { method: "POST" });
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type"), /application\/json/);
  assert.deepEqual(body, { error: "Route not found" });
});