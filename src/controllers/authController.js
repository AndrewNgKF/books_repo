import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ name }).exec();

  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        name: foundUser.name,
        roles: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );

  const refreshToken = jwt.sign(
    { name: foundUser.name },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

const refresh = (req, res) => {
  //   const refreshToken = req.headers.cookie.split("=")[1];
  const refreshToken = req.cookies.jwt;
  console.log(refreshToken);

  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const foundUser = User.findOne({ name: user.name }).exec();
    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    res.json({ accessToken });
  });
};

const logout = (req, res) => {
  res.cookie("jwt", "loggedoutbye", {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000 * 1000),
  });
  res.status(200).json({ message: "Logged out" });
};

export default {
  login,
  refresh,
  logout,
};
