const jwt = require("jsonwebtoken");

//here we are generating the token for authorization with
//the help of token we identify the access of the user what access they have.

const generateToken = (user) => {
  console.log(user);
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "28days",
    }
  );
  return token;
};

module.exports = generateToken;
