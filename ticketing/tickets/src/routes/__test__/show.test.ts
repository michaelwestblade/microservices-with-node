import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
describe("showTicketsRoutes route test", () => {
  it("returns a 404 if ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).send().expect(404);
  });

  it("returns the ticket if ticket is found", async () => {
    const cookie = global.signin();

    const { body: newTicket } = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "title",
        price: 20,
      });
    const { body: foundTicket } = await request(app)
      .get(`/api/tickets/${newTicket.id}`)
      .send()
      .expect(200);

    expect(foundTicket.title).toEqual("title");
    expect(foundTicket.price).toEqual(20);
  });
});
