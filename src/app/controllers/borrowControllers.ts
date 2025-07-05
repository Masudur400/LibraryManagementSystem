import express, { Request, Response } from "express";
import borrowModel from "../models/borrowModel";
import bookModel from "../models/bookModel";
import { handleError } from "../../utils/errorHandleManage";

export const borrowRoutes = express.Router();

// Create borrow record
borrowRoutes.post("/", async (req: Request, res: Response) => {
  const { bookId, buyerName, quantity } = req.body;

  try {
    const foundBook = await bookModel.findById(bookId);

    if (!foundBook) {
      return handleError(res, 404, "Book not found");
    }

    if (foundBook.copies < quantity) {
      return handleError(res, 400, "Not enough copies available");
    }

    foundBook.copies -= quantity;

    if (typeof foundBook.updateAvailability === "function") {
      await foundBook.updateAvailability();
    } else {
      await foundBook.save();
    }

    const borrowData = {
      bookId: foundBook._id,
      buyerName,
      quantity,
      bookTitle: foundBook.title,
      bookAuthor: foundBook.author,
      genre: foundBook.genre,
      description: foundBook.description,
    };

    const borrow = await borrowModel.create(borrowData);

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (error) {
    handleError(res, 500, "Failed to borrow book", error);
  }
});

// Get all borrow records
borrowRoutes.get("/", async (_req: Request, res: Response) => {
  try {
    const allBorrows = await borrowModel.find();

    res.status(200).json({
      success: true,
      message: "Borrow records retrieved successfully",
      data: allBorrows,
    });
  } catch (error) {
    handleError(res, 500, "Failed to retrieve borrow records", error);
  }
});
