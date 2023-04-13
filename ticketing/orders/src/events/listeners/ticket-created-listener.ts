import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@westbladetickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TICKET_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], message: Message) {
    const { id, title, price } = data;

    console.log(`New Ticket with id ${id}, title ${title}, and price ${price}`);

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();
    message.ack();
  }
}
