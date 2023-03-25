import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected to nats");

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group"
  );

  subscription.on("message", (message: Message) => {
    const data = message.getData();

    if (typeof data === "string") {
      console.log(
        `Received event #${message.getSequence()}, with data: ${data}`
      );
    }
  });
});
