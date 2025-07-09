const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let espIP = null;
const USER = { username: "admin", password: "1234" };

// Login Page
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    res.redirect("/ip");
  } else {
    res.send("Login failed. <a href='/'>Try again</a>");
  }
});

// IP Input Page
app.get("/ip", (req, res) => {
  res.render("ipform");
});

app.post("/ip", (req, res) => {
  espIP = req.body.ip;
  res.redirect("/control");
});

// Control Page
app.get("/control", (req, res) => {
  res.render("control");
});

app.post("/led", async (req, res) => {
  const action = req.body.action;
  try {
    await axios.get(`http://${espIP}/${action}`, { timeout: 2000 });
  } catch (err) {
    console.error("ESP Error:", err.message);
  }
  res.redirect("/control");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
