import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@westbladetickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

describe("New Payment Routes tests", () => {
  it("returns an error if the order does not exist", async () => {
    const cookie = global.signin();
    const orderId = new mongoose.Types.ObjectId();
    await request(app)
      .post("/api/payments")
      .set("Cookie", cookie)
      .send({ orderId, token: "test" })
      .expect(404);
  });

  it("returns an error if the order does not belong to the user", async () => {
    const cookie = global.signin();
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.CREATED,
      version: 0,
      userId: new mongoose.Types.ObjectId().toHexString(),
      price: 100,
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", cookie)
      .send({ orderId: order.id, token: "test" })
      .expect(401);
  });

  it("returns an error if the order is cancelled", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.CANCELLED,
      version: 0,
      userId,
      price: 100,
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", cookie)
      .send({ orderId: order.id, token: "test" })
      .expect(400);
  });

  it("creates a payment for an order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.CREATED,
      version: 0,
      userId,
      price: 100,
    });
    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", cookie)
      .send({ orderId: order.id, token: "tok_visa" })
      .expect(201);

    expect(stripe.charges.create).toHaveBeenCalledWith({
      amount: 10000,
      source: "tok_visa",
      currency: "usd",
    });

    const payment = await Payment.findOne({ orderId: order.id });
    expect(payment).toBeDefined();
  });
});
