const generateToken = require("../config/generateToken");
const User = require("../models/userSchema");
const argon2 = require("argon2");

//here we creating the developer through the sign up and login..

const UserRegister = async (req, res) => {
  const { email, password } = req.body;
  //here we hashing the password..

  try {
    const hash = await argon2.hash(password);
    const finduser = await User.findOne({ email });
    if (!finduser) {
      const user = await User.create({
        email,
        password: hash,
      });
      return res
        .status(201)
        .send({ user, message: "User Successfully created" });
    }
    return res.status(401).send("User Already Present");
  } catch (error) {
    return res.status(401).send("Something wents wrong");
  }
};

//here we performing the authentication process taking password and email from user..

const UserLogin = async (req, res) => {
  const { email, password } = req.body;
  // Check if user is blocked
  try {
    const user = await User.findOne({ email });
    if (user.blocked) {
      const now = new Date();
      if (now < user.blockExpires) {
        // Respond with error message if user is still blocked
        return res
          .status(403)
          .send({
            user,
            message: `User is blocked until ${user.blockExpires}`,
          });
      } else {
        // Unblock the user if the block has expired
        user.blocked = false;
        user.loginAttempts = 0;
        user.blockExpires = Date.now();
        await user.save();
      }
    }

    // Check if email is valid
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      // Increment the login attempts and block the user if necessary
      user.loginAttempts++;
      if (user.loginAttempts >= 5) {
        user.blocked = true;
        user.blockExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
      await user.save();

      // Respond with error message
      return res
        .status(400)
        .send({ user, message: "Invalid email or password" });
    }
    if (user && (await argon2.verify(user.password, password))) {
      return res.status(201).send({
        _id: user._id,
        email: user.email,
        blocked: user.blocked,
        loginAttempts: user.loginAttempts,
        blockExpires: user.blockExpires,
        token: generateToken(user),
      });
    }
  } catch (error) {
    return res.status(401).send("Something wents wrong");
  }
};

module.exports = { UserRegister, UserLogin };
