import express from "express";
import { User } from "../models/user_model";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const authRouter = express.Router();

authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ msg: "A user with that email already exists" });
    }

    var salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(password, salt);

    let user = new User({
      email,
      password: hashedPassword,
      name,
    });
    user = await user.save();

    res.json(user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

authRouter.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User with email does not exist" });
    }
    const hash = user.password;

    const isMatch: Boolean = await bcrypt.compare(password, hash);
    if (!isMatch) {
      return res.status(401).json({ msg: "Incorrect credentials" });
    }
    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({ token, ...user.toObject() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
