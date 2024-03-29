import Queue from "bull";
import { ExpirationCompletePublisher } from "../publishers/expiration-complete-publisher";
import { natsWrapper } from "../../nats-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log(
    `Publishing expiration:complete event for orderId`,
    job.data.orderId
  );

  const expirationCompletePublisher = new ExpirationCompletePublisher(
    natsWrapper.client
  );
  await expirationCompletePublisher.publish({ orderId: job.data.orderId });
});

export { expirationQueue };
