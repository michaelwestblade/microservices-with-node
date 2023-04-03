import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { randomBytes } from "crypto";

const port = process.env.port || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    console.error(error);
  }

  try {
    await natsWrapper.connect(
      "ticketing",
      randomBytes(4).toString("hex"),
      "http://nats-srv:4222"
    );
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
};

start();
