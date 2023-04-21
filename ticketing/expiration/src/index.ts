import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const NATS_URL = process.env.NATS_URL || "";
const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID || "";
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID || "";

const start = async () => {
  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    const orderCreatedListener = new OrderCreatedListener(natsWrapper.client);
    orderCreatedListener.listen();
  } catch (error) {
    console.error(error);
  }
};

start();
