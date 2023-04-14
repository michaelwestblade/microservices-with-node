import { Ticket } from "../ticket";
import mongoose from "mongoose";

describe("Ticket model", () => {
  it("implements optimistic concurrency control", async () => {
    const originalTicket = Ticket.build({
      title: "test",
      price: 20,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });

    await originalTicket.save();

    const ticketInstanceOne = await Ticket.findById(originalTicket.id);
    const ticketInstanceTwo = await Ticket.findById(originalTicket.id);

    ticketInstanceOne.set({ price: 21 });
    ticketInstanceTwo.set({ price: 22 });

    await ticketInstanceOne.save();

    await expect(ticketInstanceTwo.save()).rejects.toThrow();
  });
});
