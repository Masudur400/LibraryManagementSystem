import { Schema, model, Types } from "mongoose";
import { IBorrow } from "../interface/borrowInterface";

const borrowSchema = new Schema<IBorrow>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "At least one copy must be borrowed"],
    },
    bookTitle: {
      type: String,
      required: true,
    },
    bookAuthor: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model<IBorrow>("Borrow", borrowSchema);
