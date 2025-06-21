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
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bookModel_1 = __importDefault(require("../models/bookModel"));
const borrowModel_1 = __importDefault(require("../models/borrowModel"));
const errorHandleManage_1 = require("../../utils/errorHandleManage");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book, quantity, dueDate } = req.body;
    try {
        const foundBook = yield bookModel_1.default.findById(book);
        if (!foundBook) {
            return (0, errorHandleManage_1.handleError)(res, 404, "Book not found");
        }
        if (foundBook.copies < quantity) {
            return (0, errorHandleManage_1.handleError)(res, 400, "Not enough copies available");
        }
        foundBook.copies -= quantity;
        yield foundBook.updateAvailability();
        const borrow = yield borrowModel_1.default.create({ book, quantity, dueDate });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (error) {
        (0, errorHandleManage_1.handleError)(res, 500, "Failed to borrow book", error);
    }
}));
exports.borrowRoutes.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrowModel_1.default.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            { $unwind: "$bookDetails" },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        (0, errorHandleManage_1.handleError)(res, 500, "Failed to retrieve summary", error);
    }
}));
