import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@westbladetickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.ORDER_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], message: Message) {
    const order = Order.build({
      id: data.id,
      status: data.status,
      userId: data.userId,
      version: data.version,
      price: data.ticket.price,
    });

    await order.save();

    message.ack();
  }
}
