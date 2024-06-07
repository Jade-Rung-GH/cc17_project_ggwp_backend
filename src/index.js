require("dotenv").config();
const express = require("express");

const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/not-found");
const authRouter = require("./routers/auth-route");

const app = express();

app.use(express.json()); // can accept req.body

app.use("/auth", authRouter);
app.use("/", () => {});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

let port = process.env.PORT || 8000;
app.listen(port, () => console.log("Server on", port));
