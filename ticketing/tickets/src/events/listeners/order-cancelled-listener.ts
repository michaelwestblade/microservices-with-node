import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@westbladetickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.ORDER_CANCELLED;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], message: Message) {
    // find the ticket that the order reserved
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket) {
      throw new Error(`No ticket found for id ${data.ticket.id}`);
    }

    // Mark the ticket as being reserved by setting order id
    ticket.set({ orderId: undefined });

    // save the ticket
    await ticket.save();

    const ticketUpdatedPublisher = new TicketUpdatedPublisher(this.client);
    await ticketUpdatedPublisher.publish({
      id: ticket.id,
      title: ticket.title,
      version: ticket.version,
      userId: ticket.userId,
      price: ticket.price,
      orderId: ticket.orderId,
    });

    // ack the message
    message.ack();
  }
}
