import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@westbladetickets/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (request: Request, response: Response) => {
    const orderId = request.params.orderId;
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== request.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    response.send(order);
  }
);

export { router as showOrderRouter };
