import mongoose from "mongoose";
import { OrderStatus } from "@westbladetickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TicketDocument } from "./ticket";

// An interface that describes the properties that
// are required to create a new ticket
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

// An interface that describes the properties that a User document has
interface OrderDocument extends mongoose.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

// An interface that describes the properties a user model has
interface OrderModel extends mongoose.Model<any> {
  build: (attrs: OrderAttrs) => OrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs);

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
