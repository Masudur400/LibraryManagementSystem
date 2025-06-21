import express, { Request, Response } from "express";
import { z } from "zod";
import bookModel from "../models/bookModel";
import { handleError } from "../../utils/errorHandleManage";

export const bookRoutes = express.Router();

const BookSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    genre: z.string().min(1, "Genre is required"),
    isbn: z.string().min(1, "ISBN is required"),
    description: z.string().optional(),
    copies: z.number().min(0, "Copies must be a positive number"),
    available: z.boolean(),
});

bookRoutes.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = BookSchema.parse(req.body);
        const book = await bookModel.create(parsed);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error.flatten(),
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Failed to create book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});



bookRoutes.get("/", async (req: Request, res: Response) => {
    try {
        const {
            filter,
            sortBy = "createdAt",
            sort = "asc",
            limit,
        } = req.query;

        const query: any = {};
        if (filter) {
            query.genre = filter.toString().toUpperCase();
        }

        const sortOrder = sort === "desc" ? -1 : 1;

        let findQuery = bookModel.find(query).sort({ [sortBy as string]: sortOrder });


        if (limit !== undefined) {
            const parsedLimit = parseInt(limit as string);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
                findQuery = findQuery.limit(parsedLimit);
            }
        }

        const books = await findQuery;

        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    } catch (error) {
        handleError(res, 500, "Failed to retrieve books", error);
    }
});
  


bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        const book = await bookModel.findById(bookId);

        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                error: null,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

bookRoutes.put("/:bookId", async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        const updateData = req.body;

        const updatedBook = await bookModel.findByIdAndUpdate(bookId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                error: null,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: updatedBook,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});


bookRoutes.delete("/:bookId", async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;

        const deletedBook = await bookModel.findByIdAndDelete(bookId);

        if (!deletedBook) {
            res.status(404).json({
                success: false,
                message: `Book with ID ${bookId} not found`,
                data: null,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});