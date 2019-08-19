const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = {"name": "Kauã", "email": "kauagabrielsemenov@gmail.com"}

const users = ["Kauã Semenov", "Aline", "Kamilli"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Method: ${req.method}; URL: ${req.url};`);
  next();
  console.timeEnd("Request");
});

function checkUserNameExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserExist(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }
  req.user = user;
  return next();
}

server.post("/users", checkUserNameExist, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserExist, (req, res) => {
  return res.json(req.user);
});

server.put("/users/:index", checkUserNameExist, checkUserExist, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
});

server.delete("/users/:index", checkUserExist, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
});

server.listen(3000);
