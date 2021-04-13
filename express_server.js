const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const PORT = 8080;

app.set("view engine", "ejs");

//
// DATABASE
//

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//
// GENERATE ID
//

const generateRandomString = function() {
  // taken from https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 6; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

//
// ROOT
//

app.get("/", (req, res) => {
  res.send("Hello!");
});

//
// INDEX
//

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"], };
  res.render("urls_index", templateVars);
});

//
//  REGISTER
//

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"], };
  res.render("urls_register", templateVars);
});

//
// NEW URL PAGE
//

app.get("/urls/new", (req, res) => {
  res.render("urls_new", {username: req.cookies["username"]});
});

//
// REDIRECT SHORT URL
//

app.get("/urls/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  //const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL) {
    res.redirect(longURL);
  }
});

//
// MAKE NEW URL
//

app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  let randomString = generateRandomString();         // Respond with 'Ok' (we will replace this)
  urlDatabase[randomString] = req.body.longURL;
  res.redirect("/urls");
});

//
// REGISTER
//

app.post("/register", (req, res) => {
  res.cookie("username", req.body.username)
  res.cookie("password", req.body.password)
  const templateVars = { urls: urlDatabase, username: req.cookies["username"], };
  res.redirect("/urls");
});

//
// LOGIN
//

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username)
  res.redirect("/urls");
});

//
// LOGOUT
//

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

//
// DELETE URL
//

app.post("/urls/:shortURL/delete", (req, res) => {
  delete(urlDatabase[req.params.shortURL]);
  res.redirect("/urls");
});

//
// EDIT URL
//

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

//
// SHOW URL
//

app.post("/urls/:shortURL/show", (req, res) => {
  const urlObj = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"],}
  console.log(urlObj);
  res.render("urls_show", urlObj);
});

//
// random hello page
//

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!', username: req.cookies["username"], };
  res.render("hello_world", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});