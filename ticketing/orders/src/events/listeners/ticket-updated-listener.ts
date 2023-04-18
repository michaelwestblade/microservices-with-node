import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from "@westbladetickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TICKET_UPDATED;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], message: Message) {
    const { id, title, price, version } = data;
    const oldVersion = version - 1;
    const ticket = await Ticket.findByEvent(data);

    console.log(
      `Updating Ticket (version ${oldVersion} - ${version}) with id ${id}, title ${title}, and price ${price}`
    );

    if (!ticket) {
      throw new Error(`No ticket found for is ${id}`);
    }

    ticket.title = title;
    ticket.price = price;

    await ticket.save();
    message.ack();
  }
}
