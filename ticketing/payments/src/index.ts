import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

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

    const orderCreatedListener = new OrderCreatedListener(natsWrapper.client);
    const orderCancelledListener = new OrderCancelledListener(
      natsWrapper.client
    );
    orderCreatedListener.listen();
    orderCancelledListener.listen();

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
};

start();
