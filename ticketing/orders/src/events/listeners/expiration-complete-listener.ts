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
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.EXPIRATION_COMPLETE;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], message: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error(`No order found for orderId ${data.orderId}`);
    }

    // if order is complete return
    if (order.status === OrderStatus.COMPLETE) {
      return message.ack();
    }

    order.set({
      status: OrderStatus.CANCELLED,
    });
    await order.save();

    const orderCancelledPublisher = new OrderCancelledPublisher(this.client);
    await orderCancelledPublisher.publish({
      id: data.orderId,
      version: order.version,
      ticket: { id: order.ticket.id },
    });

    message.ack();
  }
}
