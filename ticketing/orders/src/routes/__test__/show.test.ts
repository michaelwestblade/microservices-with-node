import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
describe("Show Order Routes tests", () => {
  it("fetches an order by id", async () => {
    const cookie = global.signin();
    const ticket = Ticket.build({
      title: "test",
      price: 20,
    });
    await ticket.save();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: userOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(userOrder.id).toEqual(order.id);
  });

  it("returns an error if user does not own order", async () => {
    const user1 = global.signin();
    const user2 = global.signin();
    const ticket = Ticket.build({
      title: "test",
      price: 20,
    });
    await ticket.save();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user1)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: userOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", user2)
      .send()
      .expect(401);
  });

  it("returns an error if order is not found", async () => {
    const cookie = global.signin();
    const { body: userOrder } = await request(app)
      .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
      .set("Cookie", cookie)
      .send()
      .expect(404);
  });
});
