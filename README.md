# 📚 Library Management System

A full-featured backend API for managing books and borrow records in a library, built using **Express.js**, **TypeScript**, and **MongoDB** (via Mongoose).

---

## 🎯 Objective

This system enables:
- Creating, updating, deleting, and fetching books
- Borrowing books with available copy tracking
- Summarizing total borrow data using aggregation
- Validating input with Zod and Mongoose
- Filtering, sorting, and paginating book data

---

## ✨ Features

### 📘 Book Features
- Create, Read, Update, Delete (CRUD)
- Genre restricted to:
  `FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY`
- Unique ISBN validation
- Available copies tracking
- Schema validation using Zod

### 🔄 Borrow Features
- Borrow books with quantity and due date
- Decrease available copies automatically
- If copies reach 0, `available = false`
- Borrow summary using aggregation

### 🧠 Advanced Logic
- Zod validation errors with full format
- Static or instance method for borrow logic
- Middleware (pre/post) for Mongoose events
- Aggregation pipeline for borrow analytics

---

## 🔧 Tech Stack

- Node.js + Express.js
- TypeScript
- MongoDB with Mongoose
- Zod for validation
- dotenv for config
- ts-node-dev for development

 
