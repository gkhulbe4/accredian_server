import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import db from "../utils/db.js";
import sendMail from "../utils/sendMail.js";

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

router.get("/", async (req, res) => {
  try {
    const courses = await db.course.findMany({
      select: {
        title: true,
        desc: true,
        id: true,
      },
    });
    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ message: "An error occured", error });
  }
});

router.post("/create", async (req, res) => {
  const course = await db.course.createMany({
    data: [
      {
        title: "Ruby on Rails ",
        desc: "Get started with Ruby on Rails, a developer-friendly framework, and build modern web applications quickly and efficiently.",
      },
      {
        title: "JavaScript",
        desc: "Master JavaScript, the versatile language of the web, and build interactive and dynamic web applications with ease.",
      },
      {
        title: "Python",
        desc: "Learn Python, a powerful and beginner-friendly language, to develop a wide range of applications from web development to data analysis.",
      },
      {
        title: "Java",
        desc: "Dive into Java, a robust and platform-independent language, and build scalable and high-performance applications.",
      },
      {
        title: "C++",
        desc: "Explore C++, a high-performance language, to develop efficient systems, game engines, and complex algorithms.",
      },
      {
        title: "Swift",
        desc: "Get started with Swift, Apple's powerful and intuitive language, to create beautiful iOS and macOS applications.",
      },
      {
        title: "Go",
        desc: "Learn Go, a statically typed and compiled language, known for its simplicity and efficiency in building reliable software.",
      },
      {
        title: "PHP",
        desc: "Understand PHP, a server-side scripting language, and develop dynamic and interactive web applications with ease.",
      },
    ],
  });
  return res.status(200).json({ message: "Course created", course });
});

router.post("/refer", async (req, res) => {
  const { courseId, courseTitle, referrerId, refereeEmail, referrerEmail } =
    req.body;
  try {
    const checkUser = await db.user.findFirst({
      where: {
        email: refereeEmail,
      },
    });
    if (!checkUser) {
      return res
        .status(400)
        .json({ message: "This user is not registered to our platform" });
    }

    if (checkUser.email === referrerEmail) {
      return res.status(400).json({ message: "You cannot refer yourself" });
    }

    const checkCourse = await db.ref_Mapping.findUnique({
      where: {
        refereeEmail_courseId: {
          refereeEmail: refereeEmail,
          courseId: courseId,
        },
      },
    });
    if (checkCourse) {
      return res
        .status(400)
        .json({ message: "This user has already been referred" });
    }

    const refer = await db.ref_Mapping.create({
      data: {
        courseId: courseId,
        refereeEmail: refereeEmail,
        referrerId: referrerId,
      },
    });
    console.log(courseTitle);
    await sendMail(refereeEmail, checkUser.name, courseTitle);
    return res.status(200).json({ message: "Referred successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occured", error });
  }
});

export default router;
