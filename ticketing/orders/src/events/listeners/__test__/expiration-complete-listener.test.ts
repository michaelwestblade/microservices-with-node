import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { ExpirationCompleteEvent, OrderStatus } from "@westbladetickets/common";
import { Order } from "../../../models/order";

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ticket",
    price: 100,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket,
  });
  await order.save();

  // create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, message };
};
describe("expiration complete listener", () => {
  it("updates the order status to cancelled", async () => {
    const { listener, order, ticket, data, message } = await setup();
    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(data.orderId);
    expect(updatedOrder.status).toEqual(OrderStatus.CANCELLED);
  });

  it("emits order cancelled event", async () => {
    const { listener, order, ticket, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(
      JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    ).toEqual({
      id: order.id,
      version: order.version + 1,
      ticket: { id: order.ticket.id },
    });
  });

  it("should ack the message", async () => {
    const { listener, order, ticket, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
