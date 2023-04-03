import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@westbladetickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TICKET_CREATED;
}
