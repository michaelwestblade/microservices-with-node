import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@westbladetickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.ORDER_CANCELLED;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], message: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error(`Order ${data.id} not found`);
    }

    order.set({
      status: OrderStatus.CANCELLED,
    });
    await order.save();

    message.ack();
  }
}
