import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const buildTicket = async (id: string, title: string, price: number) => {
  const ticket = Ticket.build({
    id,
    title,
    price,
  });
  await ticket.save();

  return ticket;
};

describe("Index Order Routes tests", () => {
  it("fetches orders for a particular user", async () => {
    const user1 = global.signin();
    const user2 = global.signin();
    const ticket1 = await buildTicket(
      new mongoose.Types.ObjectId().toHexString(),
      "ticket 1",
      1
    );
    const ticket2 = await buildTicket(
      new mongoose.Types.ObjectId().toHexString(),
      "ticket 2",
      2
    );
    const ticket3 = await buildTicket(
      new mongoose.Types.ObjectId().toHexString(),
      "ticket 3",
      3
    );

    const { body: order1 } = await request(app)
      .post("/api/orders")
      .set("Cookie", user1)
      .send({ ticketId: ticket1.id })
      .expect(201);

    const { body: order2 } = await request(app)
      .post("/api/orders")
      .set("Cookie", user1)
      .send({ ticketId: ticket2.id })
      .expect(201);

    const { body: order3 } = await request(app)
      .post("/api/orders")
      .set("Cookie", user2)
      .send({ ticketId: ticket3.id })
      .expect(201);

    const { body: user1Orders } = await request(app)
      .get("/api/orders")
      .set("Cookie", user1)
      .send();

    expect(user1Orders.length).toBe(2);
    expect(user1Orders[0].id).toEqual(order1.id);
    expect(user1Orders[1].id).toEqual(order2.id);

    const { body: user2Orders } = await request(app)
      .get("/api/orders")
      .set("Cookie", user2)
      .send();

    expect(user2Orders.length).toBe(1);
    expect(user2Orders[0].id).toEqual(order3.id);
  });
});
