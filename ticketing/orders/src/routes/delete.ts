import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@westbladetickets/common";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

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

    const orderCancelledPublisher = new OrderCancelledPublisher(
      natsWrapper.client
    );
    await orderCancelledPublisher.publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    response.send(order);
  }
);

export { router as deleteOrderRouter };
