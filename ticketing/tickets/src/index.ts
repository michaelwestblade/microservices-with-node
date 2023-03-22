import mongoose from "mongoose";
import { app } from "./app";

const port = process.env.port || 3000;

const start = async () => {
  try {
    await mongoose.connect(`mongodb://tickets-mongo-srv:27017/auth`);
    console.log("DB connected");
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
};

start();
