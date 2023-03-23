import mongoose from "mongoose";

// An interface that describes the properties that
// are required to create a new ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties that a User document has
interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties a user model has
interface TicketModel extends mongoose.Model<any> {
  build: (attrs: TicketAttrs) => TicketDocument;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket };
