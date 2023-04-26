import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@westbladetickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.ORDER_CREATED;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], message: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log(`waiting ${delay} milliseconds to process the job`);

    await expirationQueue.add({ orderId: data.id }, { delay });

    message.ack();
  }
}
