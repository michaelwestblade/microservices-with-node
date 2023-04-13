import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@westbladetickets/common";
import { natsWrapper } from "../../nats-wrapper";
describe("Delete Order Routes tests", () => {
  it("marks an order as cancelled", async () => {
    const cookie = global.signin();
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
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
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(userOrder.id).toEqual(order.id);

    const { body: cancelledOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(userOrder.status).toEqual(OrderStatus.CANCELLED);
  });

  it("returns an error if user does not own order", async () => {
    const user1 = global.signin();
    const user2 = global.signin();
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
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
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", user2)
      .send()
      .expect(401);
  });

  it("returns an error if order is not found", async () => {
    const cookie = global.signin();
    const { body: userOrder } = await request(app)
      .delete(`/api/orders/${new mongoose.Types.ObjectId()}`)
      .set("Cookie", cookie)
      .send()
      .expect(404);
  });

  it("returns an error if order already completed", async () => {
    const cookie = global.signin();
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test",
      price: 20,
    });
    await ticket.save();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    const newOrder = await Order.findById(order.id);
    newOrder.status = OrderStatus.COMPLETE;
    newOrder.save();

    const { body: userOrder } = await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(400);
  });

  it("emits an order cancelled event", async () => {
    const cookie = global.signin();
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
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
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
