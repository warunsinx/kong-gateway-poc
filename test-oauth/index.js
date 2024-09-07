const fs = require("fs");
const express = require("express");
const app = express();
const data = require("./data.json");
const https = require("https");
const SSL_CERT = fs.readFileSync("./certificates/cert.pem");
const SSL_KEY = fs.readFileSync("./certificates/key.pem");
const port = 7788;

const getCurrentUser = ({ headers }) => {
  return headers["mock-logged-in-as"] || headers["x-authenticated-userid"];
};

app.get("/verify", (req, res) => {
  console.log(req.headers);
  const user = getCurrentUser(req);
  if (!user) {
    res.status(401).send("Not authorized");
    return;
  }
  res.send(data[user] || []);
});

const server = https.createServer({ key: SSL_KEY, cert: SSL_CERT }, app);
server.listen(port, () => {
  console.log(`Server is listening on https://localhost:${port} `);
});
