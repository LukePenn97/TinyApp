const findIdByEmail = function(currentEmail, users) {
  for (const userID in users) {
    if (users[userID].email === currentEmail) {
      return userID;
    }
  }
};

const generateRandomString = function(num) {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = num; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

module.exports = {findIdByEmail, generateRandomString};