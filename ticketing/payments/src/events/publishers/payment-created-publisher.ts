import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@westbladetickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PAYMENT_CREATED;
}
