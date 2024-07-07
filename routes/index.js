import express from "express";
import userRouter from "./user.js";
import courseRouter from "./course.js";

const app = express();
const port = 3000;

app.use("/user", userRouter);
app.use("/course", courseRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
