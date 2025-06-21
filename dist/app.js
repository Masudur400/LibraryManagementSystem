"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookControllers_1 = require("./app/controllers/bookControllers");
const borrowControllers_1 = require("./app/controllers/borrowControllers");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/books", bookControllers_1.bookRoutes);
app.use("/api/borrow", borrowControllers_1.borrowRoutes);
app.get('/', (req, res) => {
    res.send('Library Management System Is Running......!');
});
exports.default = app;
