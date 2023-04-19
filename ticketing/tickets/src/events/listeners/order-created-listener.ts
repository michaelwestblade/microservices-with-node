import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@westbladetickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { Message } from "node-nats-streaming";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly queueGroupName = queueGroupName;
  readonly subject = Subjects.ORDER_CREATED;
  async onMessage(data: OrderCreatedEvent["data"], message: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket) {
      throw new Error(`No ticket found for id ${data.ticket.id}`);
    }

    // Mark the ticket as being reserved by setting order id
    ticket.set({ orderId: data.id });

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
