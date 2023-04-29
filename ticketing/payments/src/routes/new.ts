import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@westbladetickets/common";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      console.log(order);
      console.log(order.userId);
      console.log(req.currentUser?.id);
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestError(`Order ${orderId} is cancelled`);
    }

    // create payment
    res.send({ success: true });
  }
);

export { router as createPaymentRouter };
