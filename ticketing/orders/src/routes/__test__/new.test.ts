import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@westbladetickets/common";
import { natsWrapper } from "../../nats-wrapper";

describe("New Order Routes tests", () => {
  it("returns an error if the ticket does not exist", async () => {
    const cookie = global.signin();
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId })
      .expect(404);
  });

  it("returns an error if the ticket is already reserved", async () => {
    const cookie = global.signin();
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test",
      price: 20,
    });
    await ticket.save();

    const order = Order.build({
      ticket,
      userId: "randomId",
      status: OrderStatus.CREATED,
      expiresAt: new Date(),
    });
    await order.save();

    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it("reserves a ticket", async () => {
    const cookie = global.signin();
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test",
      price: 20,
    });
    await ticket.save();

    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);
  });

  it("emits an order created event", async () => {
    const cookie = global.signin();
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test",
      price: 20,
    });
    await ticket.save();

    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
