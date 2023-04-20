import mongoose from "mongoose";
import { OrderCreatedListener } from "../listeners/order-created-listener";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@westbladetickets/common";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: "test",
    price: 99,
    userId: "user",
  });
  await ticket.save();

  // create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.CREATED,
    expiresAt: "",
    userId: "user",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

describe("order created listener", () => {
  it("sets the userId of the ticket", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.ticket.id);
    expect(ticket.orderId).toEqual(data.id);
  });

  it("acks the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it("published a ticket updated event", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(data.id).toEqual(ticketUpdatedData.orderId);
  });
});
