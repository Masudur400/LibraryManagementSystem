"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const borrowSchema = new mongoose_1.Schema({
    bookId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    versionKey: false,
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Borrow", borrowSchema);
