import mongoose from "mongoose";
import { OrderStatus } from "@westbladetickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties that
// are required to create a new ticket
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

// An interface that describes the properties that a User document has
interface OrderDocument extends mongoose.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
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
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) =>
  new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.price,
    status: attrs.status,
  });

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
