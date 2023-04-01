import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TICKET_CREATED;
  queueGroupName = "payments-service";

  onMessage = (data: TicketCreatedEvent["data"], message: Message) => {
    console.log(`Event data`, data);

    message.ack();
  };
}
