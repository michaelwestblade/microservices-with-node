import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

const createTicket = (title: string, price: number) => {
  const cookie = global.signin();
  return request(app).post("/api/tickets").set("Cookie", cookie).send({
    title,
    price,
  });
};
describe("indexTicketRouter routes test", () => {
  it("can fetch a list of tickets", async () => {
    const cookie = global.signin();

    await createTicket("title 1", 20);
    await createTicket("title 2", 35);
    await createTicket("ticket 3", 50);
    const { body: tickets } = await request(app).get(`/api/tickets`).send();

    expect(tickets.length).toEqual(3);
  });
});
