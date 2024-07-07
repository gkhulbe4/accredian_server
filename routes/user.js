import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import bodyParser from "body-parser";
import { compare, hash } from "bcrypt";
import "dotenv/config";
import db from "../utils/db.js";

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());
const secret = process.env.JWT_SECRET;

const createToken = (id) => {
  return jwt.sign({ id }, secret, { expiresIn: "365d" });
};

const verifyToken = async (token) => {
  const decoded = await jwt.verify(token, secret);
  return decoded.id;
};

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPass = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPass,
      },
    });
    const token = createToken(newUser.id);

    return res.status(200).json({
      message: `Registered successfully`,
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        id: newUser.id,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occured", error });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!userExists) {
      return res
        .status(500)
        .json({ message: "Please create an account first" });
    }
    const confirmPassword = await compare(password, userExists.password);
    if (!confirmPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = createToken(userExists.id);
    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        name: userExists.name,
        email: userExists.email,
        id: userExists.id,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occured", error });
  }
});

router.post("/currentUser", async (req, res) => {
  const { token } = req.body;
  //   console.log(token);
  const decoded = await verifyToken(token);
  try {
    const user = await db.user.findUnique({
      where: {
        id: parseInt(decoded),
      },
    });
    // console.log(user);
    return res.status(200).json({ message: "User found", user });
  } catch (error) {
    return res.status(500).json({ message: "An error occured", error });
  }
});

export default router;
