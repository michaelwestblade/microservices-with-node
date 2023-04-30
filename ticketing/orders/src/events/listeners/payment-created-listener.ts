import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@westbladetickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PAYMENT_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], message: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error(`Order ${data.orderId} not found`);
    }

    order.set({
      status: OrderStatus.COMPLETE,
    });
    await order.save();

    message.ack();
  }
}
