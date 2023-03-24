import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@westbladetickets/common";
import { body } from "express-validator";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be a number greater than 0"),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { title, price } = request.body;

    const ticket = await Ticket.findById(request.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== request?.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title,
      price,
    });
    await ticket.save();

    response.send(ticket);
  }
);

export { router as updateTicketRouter };
