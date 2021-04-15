const findIdByEmail = function(currentEmail, users) {
  for (const userID in users) {
    if (users[userID].email === currentEmail) {
      return userID;
    }
  }
};

module.exports = {findIdByEmail};