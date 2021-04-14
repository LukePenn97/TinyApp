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
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "b2xVn2"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "9sm5xK"},
};

//
// USERS DATA
//

const users = {}

//
// FIND EMAIL IN USERS
//

const findEmail = function(currentEmail) {
  for (const userID in users) {
    if (users[userID].email === currentEmail) {
      return true;
    }
  }
  return false;
}

//
// FIND ID BY EMAIL
//

const findIdByEmail = function(currentEmail) {
  for (const userID in users) {
    if (users[userID].email === currentEmail) {
      return userID;
    }
  }
}

//
// GENERATE ID
//

const generateRandomString = function(num) {
  // taken from https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = num; i > 0; --i) {
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
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"], users: users};
  res.render("urls_index", templateVars);
});

//
//  REGISTER
//

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"], users: users};
  res.render("urls_register", templateVars);
});

//
// LOGIN
//

app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"], users: users};
  res.render("urls_login", templateVars);
});

//
// NEW URL PAGE
//

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"], users: users};
  if (req.cookies["user_id"]) {
    res.render("urls_new", templateVars);
  }
  res.render("urls_login", templateVars);
});

//
// REDIRECT SHORT URL
//

app.get("/urls/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  //const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (longURL) {
    res.redirect(longURL);
  }
});

//
// MAKE NEW URL
//

app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  let urlID = generateRandomString(6);         // Respond with 'Ok' (we will replace this)
  urlDatabase[urlID] = {};
  urlDatabase[urlID].longURL = req.body.longURL;
  urlDatabase[urlID].userID = req.cookies["user_id"];
  res.redirect("/urls");
});

//
// REGISTER
//

app.post("/register", (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.status(400).send("error, missing field");
  }
   if(findEmail(req.body.email)) {
    res.status(400).send("error, email already exists");
    
  }
  let userID = generateRandomString(6);
  users[userID] = {};
  users[userID].id = userID;
  users[userID].email = req.body.email;
  users[userID].password = req.body.password;
  res.cookie("user_id", userID);
  console.log(users[userID]);
  res.redirect("/urls");
  
});

//
// LOGIN
//

app.post("/login", (req, res) => {
  let userID = findIdByEmail(req.body.email)
  if(!req.body.email || !req.body.password) {
    res.status(403).send("error, missing field");

  } 
  if(!findEmail(req.body.email)) {
    res.status(403).send("error, email doesn't exist!");

  }
  if (users[userID].password !== req.body.password) {
    res.status(403).send("error, passwords don't match!");

  }
  console.log("Login: ", users[userID])
  res.cookie("user_id", userID);
  res.redirect("/urls");
  
  
});

//
// LOGOUT
//

app.post("/logout", (req, res) => {
  console.log("Before clear in logout:", users);
  res.clearCookie("user_id");
  console.log("After clear:", users);
  res.redirect("/urls");
});

//
// DELETE URL
//

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
    delete(urlDatabase[req.params.shortURL]);
  }
  res.redirect("/urls");
});

//
// EDIT URL
//

app.post("/urls/:shortURL/edit", (req, res) => {
  if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {  
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  }
  res.redirect("/urls");
});

//
// SHOW URL
//

app.post("/urls/:shortURL/show", (req, res) => {
  const urlObj = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user_id: req.cookies["user_id"],}
  console.log(urlObj);
  res.render("urls_show", urlObj);
});

//
// random hello page
//

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!', user_id: req.cookies["user_id"], };
  res.render("hello_world", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});