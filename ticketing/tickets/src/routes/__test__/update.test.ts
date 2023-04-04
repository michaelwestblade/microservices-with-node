import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

describe("updateTicketRouter route tests", () => {
  it("returns a 404 if provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin();
    await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", cookie)
      .send({ title: "tester", price: 100 })
      .expect(404);
  });

  it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/tickets/${id}`)
      .send({ title: "tester", price: 100 })
      .expect(401);
  });

  it("returns a 401 if the user does not own the ticket", async () => {
    const cookie = global.signin();

    const { body: ticket } = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "title",
        price: 20,
      });

    const cookie2 = global.signin();

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set("Cookie", cookie2)
      .send({
        title: "title",
        price: 20,
      })
      .expect(401);
  });

  it("returns a 400 if the user provides and invalid title or price", async () => {
    const cookie = global.signin();

    const { body: ticket } = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "title",
        price: 20,
      });

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set("Cookie", cookie)
      .send({
        title: "",
        price: 20,
      })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set("Cookie", cookie)
      .send({
        title: "tester",
        price: -1,
      })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set("Cookie", cookie)
      .send({})
      .expect(400);
  });

  it("updates the ticket provided valid inputs", async () => {
    const cookie = global.signin();

    const { body: ticket } = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "title",
        price: 20,
      });

    const { body: ticketUpdate } = await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set("Cookie", cookie)
      .send({
        title: "test",
        price: 21,
      });

    const { body: updatedTicket } = await request(app)
      .get(`/api/tickets/${ticket.id}`)
      .send();

    expect(updatedTicket.title).toEqual("test");
    expect(updatedTicket.price).toEqual(21);
  });

  it("publishes an event", async () => {
    const cookie = global.signin();

    const { body: ticket } = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "title",
        price: 20,
      });

    const { body: ticketUpdate } = await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set("Cookie", cookie)
      .send({
        title: "test",
        price: 21,
      });

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
  });
});
