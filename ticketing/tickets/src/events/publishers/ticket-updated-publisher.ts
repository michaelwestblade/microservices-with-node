import { Publisher, Subjects } from "@westbladetickets/common";
import { TicketUpdatedEvent } from "@westbladetickets/common/build/events/ticket-updated-event";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TICKET_UPDATED;
}
