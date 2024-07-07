import nodemailer from "nodemailer";
import "dotenv/config";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const sendMail = async (email, name, courseTitle) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./temp"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./temp"),
      extName: ".handlebars",
    })
  );

  const mailOptions = {
    from: {
      name: "Accredian",
      address: process.env.USER_EMAIL,
    },
    to: `${email}`,
    subject: "Referral Email",
    template: "index",
    context: {
      name: `${name}`,
      courseTitle: `${courseTitle}`,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Mail sent");
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
