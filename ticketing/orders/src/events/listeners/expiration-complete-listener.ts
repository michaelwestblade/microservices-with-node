import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
  TicketCreatedEvent,
} from "@westbladetickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.EXPIRATION_COMPLETE;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], message: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error(`No order found for orderId ${data.orderId}`);
    }

    order.set({
      status: OrderStatus.CANCELLED,
    });
    await order.save();

    message.ack();
  }
}
