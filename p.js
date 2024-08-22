const pass = {
  challenge: false, // Set to true if you want to enable password protection.
  users: {
    // Add more users in the format username: "password",
    // Dont forget to put , at the end like username: "password", or it wont work
    username: "password",
    anotheruser: "anotherpassword",
  },
};
const authenticate = (username, password) => {
  if (!pass.challenge) {
    return true;
  }
  return pass.users[username] && pass.users[username] === password;
};

export { pass, authenticate };
