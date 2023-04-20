import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { randomBytes } from "crypto";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const port = process.env.port || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
const NATS_URL = process.env.NATS_URL || "";
const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID || "";
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID || "";

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    console.error(error);
  }

  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (error) {
    console.error(error);
  }

  const orderCancelledListener = new OrderCancelledListener(natsWrapper.client);
  const orderCreatedListener = new OrderCreatedListener(natsWrapper.client);

  await orderCancelledListener.listen();
  await orderCreatedListener.listen();

  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
};

start();
