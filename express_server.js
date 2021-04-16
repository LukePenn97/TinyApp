const bcrypt = require('bcrypt');
const {findIdByEmail, generateRandomString} = require('./helpers.js');

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true })); // bodyParser deprecated
const PORT = 8080;
app.set("view engine", "ejs");

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'user_id',
  keys: ['the most secret secret of all the secrets', 'the second most secret secret'],
}));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//
// URL DATABASE + USERS INFO
//

const urlDatabase = {
  yXNVnR: {
    longURL: 'http://www.example.com',
    userID: 'ICuxdB'
  }
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

//
// GET ROOT
//

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  res.redirect("/login");
});

//
// GET INDEX
//

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.session.user_id, users: users};
  res.render("urls_index", templateVars);
});

//
// GET NEW URL PAGE
//

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.session.user_id, users: users};
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
    return;
  }
  res.render("urls_login", templateVars);
});

//
// GET EDIT PAGE
//

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.session.user_id, users: users, shortURL: req.params.shortURL};
  if (req.session.user_id) {
    if (urlDatabase[req.params.shortURL]) {
      if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
        res.render("urls_show", templateVars);
        return;
      }
      res.status(400).send("error, short URL does not belong to you");
      return;
    }
    res.status(400).send("error, short URL does not exist");
    return;
  }
  res.status(400).send("error, not logged in");
  return;
});

//
// GET REDIRECT
//

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    urlDatabase[req.params.shortURL].visits ? urlDatabase[req.params.shortURL].visits++ : urlDatabase[req.params.shortURL].visits = 1;
    console.log(urlDatabase[req.params.shortURL].longURL, "has been visited", urlDatabase[req.params.shortURL].visits, "times");
    res.redirect(urlDatabase[req.params.shortURL].longURL);
    return;
  }
  res.status(400).send("error, short URL does not exist");
  return;
});

//
// POST NEW URL
//

app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    let urlID = generateRandomString(6);
    urlDatabase[urlID] = {};
    urlDatabase[urlID].longURL = req.body.longURL;
    urlDatabase[urlID].userID = req.session.user_id;
    urlDatabase[urlID].visits = 0;
    res.redirect("/urls");
    return;
  }
  res.status(400).send("error, not logged in. (also, how did you get here?)");
  return;
});

//
// PUT EDIT URL
//

app.put("/urls/:shortURL", (req, res) => {
  if (req.session.user_id) {
    if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
      urlDatabase[req.params.shortURL].longURL = req.body.longURL;
      res.redirect("/urls");
      return;
    }
    res.status(400).send("error, short URL does not belong to you");
    return;
  }
  res.status(400).send("error, not logged in.");
  return;
});

//
// DELETE URL
//

app.delete("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id) {
    if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
      delete(urlDatabase[req.params.shortURL]);
      res.redirect("/urls");
      return;
    }
    res.status(400).send("error, short URL does not belong to you");
    return;
  }
  res.status(400).send("error, not logged in.");
  return;
});

//
//  GET REGISTER PAGE
//

app.get("/register", (req, res) => {
  if (!req.session.user_id) {
    const templateVars = { urls: urlDatabase, user_id: req.session.user_id, users: users};
    res.render("urls_register", templateVars);
    return;
  }
  res.redirect("/urls");
});

//
// GET LOGIN PAGE
//

app.get("/login", (req, res) => {
  if (!req.session.user_id) {
    const templateVars = { urls: urlDatabase, user_id: req.session.user_id, users: users};
    res.render("urls_login", templateVars);
    return;
  }
  res.redirect("/urls");
});

//
// POST REGISTER
//

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("error, missing field");
    return;
  }
  if (findIdByEmail(req.body.email, users)) {
    res.status(400).send("error, email already exists");
    return;
  }

  let userID = generateRandomString(6);
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[userID] = {};
  users[userID].id = userID;
  users[userID].email = req.body.email;
  users[userID].password = hashedPassword;
  req.session.user_id = userID;
  res.redirect("/urls");
});

//
// POST LOGIN
//

app.post("/login", (req, res) => {
  let userID = findIdByEmail(req.body.email, users);
  if (!req.body.email || !req.body.password) {
    res.status(403).send("error, missing field");
    return;
  }
  if (!userID) {
    res.status(403).send("error, email doesn't exist!");
    return;

  }
  if (!bcrypt.compareSync(req.body.password, users[userID].password)) {
    res.status(403).send("error, passwords don't match!");
    return;
  }
  req.session.user_id = userID;
  res.redirect("/urls");
});

//
// POST LOGOUT
//

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// server on

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});