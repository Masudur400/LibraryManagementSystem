import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
require('dotenv').config()

let server: Server;

const port = 5000;

async function main() {
    try {
        await mongoose.connect(`mongodb+srv://libraryManagementSystem:1XYAxo6IHSQhswvq@cluster0.nhw8ipw.mongodb.net/library-db?retryWrites=true&w=majority`);

        console.log("Connected to MongoDB Using Mongoose!!"); 
        server = app.listen(port, () => {
            console.log(`Library Management System App listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

main()

// require('dotenv').config()

// import { Server } from "http";
// import app from "./app";
// import mongoose from "mongoose";



// let server: Server;

// const PORT = 5000;

// async function main() {
//   try {
//     await mongoose.connect(process.env.DB_URI as string);
//       console.log("Database connected");
//     server = app.listen(PORT, () => {
//       console.log(`Server is listening on port ${PORT}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// main();

