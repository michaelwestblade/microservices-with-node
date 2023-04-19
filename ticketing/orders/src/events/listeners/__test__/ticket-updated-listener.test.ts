import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@westbladetickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 100,
  });
  await ticket.save();

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "tester",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { ticket, listener, data, message };
};
describe("ticket created listener", () => {
  it("should update a ticket", async () => {
    const { ticket, listener, data, message } = await setup();
    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(data.id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
  });

  it("should ack the message", async () => {
    const { ticket, listener, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it("does not call ack if the event has a skipped version number", async () => {
    const { message, data, listener, ticket } = await setup();

    data.version = 10;

    await expect(listener.onMessage(data, message)).rejects.toThrow();

    expect(message.ack).not.toHaveBeenCalled();
  });
});
