require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/not-found");
const authRouter = require("./routers/auth-route");
const platformRouter = require("./routers/platform-route");
const hostRouter = require("./routers/host-route");

const app = express();

app.use(express.json()); // can accept req.body

app.use(cors());
app.use("/auth", authRouter);
app.use("/games", platformRouter);
app.use("/host", hostRouter);
app.use("/attend", () => {});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

let port = process.env.PORT || 8000;
app.listen(port, () => console.log("Server on", port));
