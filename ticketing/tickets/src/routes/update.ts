import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  BadRequestError,
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@westbladetickets/common";
import { body } from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

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
      console.log(`No ticket found for id ${request.params.id}`);
      throw new NotFoundError();
    }

    if (ticket.userId !== request?.currentUser?.id) {
      console.log(
        `User ${request?.currentUser?.id} does not match id on ticket ${ticket.userId}`
      );
      throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
      console.log(`Ticket ${ticket.id} is already reserved`);
      throw new BadRequestError(`Ticket ${ticket.id} is already reserved`);
    }

    ticket.set({
      title,
      price,
    });
    await ticket.save();

    const ticketUpdatedPublisher = new TicketUpdatedPublisher(
      natsWrapper.client
    );
    await ticketUpdatedPublisher.publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    response.send(ticket);
  }
);

export { router as updateTicketRouter };
