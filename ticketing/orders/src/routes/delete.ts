import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@westbladetickets/common";

const router = express.Router();

router.delete(
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

    if (order.status === OrderStatus.COMPLETE) {
      throw new BadRequestError(
        `Order cannot be deleted because it has completed`
      );
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    response.send(order);
  }
);

export { router as deleteOrderRouter };
