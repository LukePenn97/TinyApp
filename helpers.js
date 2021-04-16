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

const findVisitorId = function(visitorId, arrayOfObjects) {
  for (const obj of arrayOfObjects) {
    if (obj.visitorId === visitorId) {
      return true;
    }
  }
  return false;
};

module.exports = {findIdByEmail, generateRandomString, findVisitorId};