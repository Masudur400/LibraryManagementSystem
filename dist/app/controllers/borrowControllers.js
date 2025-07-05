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
const borrowModel_1 = __importDefault(require("../models/borrowModel"));
const bookModel_1 = __importDefault(require("../models/bookModel"));
const errorHandleManage_1 = require("../../utils/errorHandleManage");
exports.borrowRoutes = express_1.default.Router();
// Create borrow record
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId, buyerName, quantity } = req.body;
    try {
        const foundBook = yield bookModel_1.default.findById(bookId);
        if (!foundBook) {
            return (0, errorHandleManage_1.handleError)(res, 404, "Book not found");
        }
        if (foundBook.copies < quantity) {
            return (0, errorHandleManage_1.handleError)(res, 400, "Not enough copies available");
        }
        foundBook.copies -= quantity;
        if (typeof foundBook.updateAvailability === "function") {
            yield foundBook.updateAvailability();
        }
        else {
            yield foundBook.save();
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
        const borrow = yield borrowModel_1.default.create(borrowData);
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
// Get all borrow records
exports.borrowRoutes.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBorrows = yield borrowModel_1.default.find();
        res.status(200).json({
            success: true,
            message: "Borrow records retrieved successfully",
            data: allBorrows,
        });
    }
    catch (error) {
        (0, errorHandleManage_1.handleError)(res, 500, "Failed to retrieve borrow records", error);
    }
}));
