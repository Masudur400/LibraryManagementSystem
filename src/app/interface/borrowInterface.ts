import { Types } from "mongoose";





export interface IBorrow {
  bookId: Types.ObjectId;
  buyerName: string;
  quantity: number;
  bookTitle: string;
  bookAuthor: string;
  genre: string;
  description: string;
}
