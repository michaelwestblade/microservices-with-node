import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@westbladetickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.EXPIRATION_COMPLETE;
}
