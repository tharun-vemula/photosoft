const crypto = require('node:crypto');
const digits = '0123456789';

exports.generate = () => {
  const length = +6;

  const generateOptions = {
    digits: true,
    lowerCaseAlphabets: true,
    upperCaseAlphabets: true,
  };

  const allowsChars = (generateOptions.digits || '') && digits;

  let password = '';
  while (password.length < length) {
    const charIndex = crypto.randomInt(0, allowsChars.length);
    password += allowsChars[charIndex];
  }
  return password;
};
