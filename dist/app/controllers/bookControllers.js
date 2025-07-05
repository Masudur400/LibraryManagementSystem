"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const bookModel_1 = __importDefault(require("../models/bookModel"));
const errorHandleManage_1 = require("../../utils/errorHandleManage");
exports.bookRoutes = express_1.default.Router();
const BookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    author: zod_1.z.string().min(1, "Author is required"),
    genre: zod_1.z.string().min(1, "Genre is required"),
    isbn: zod_1.z.string().min(1, "ISBN is required"),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().min(0, "Copies must be a positive number"),
    available: zod_1.z.string(),
});
exports.bookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = BookSchema.parse(req.body);
        const book = yield bookModel_1.default.create(parsed);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
}));
exports.bookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "asc", limit, } = req.query;
        const query = {};
        if (filter) {
            query.genre = filter.toString().toUpperCase();
        }
        const sortOrder = sort === "desc" ? -1 : 1;
        let findQuery = bookModel_1.default.find(query).sort({ [sortBy]: sortOrder });
        if (limit !== undefined) {
            const parsedLimit = parseInt(limit);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
                findQuery = findQuery.limit(parsedLimit);
            }
        }
        const books = yield findQuery;
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        (0, errorHandleManage_1.handleError)(res, 500, "Failed to retrieve books", error);
    }
}));
exports.bookRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield bookModel_1.default.findById(bookId);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
exports.bookRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updateData = req.body;
        const updatedBook = yield bookModel_1.default.findByIdAndUpdate(bookId, updateData, {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
exports.bookRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const deletedBook = yield bookModel_1.default.findByIdAndDelete(bookId);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
