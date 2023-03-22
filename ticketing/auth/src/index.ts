import mongoose from "mongoose";
import { app } from "./app";

const port = process.env.port || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
};

start();
