import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
require('dotenv').config()

let server: Server;

const port = 5000;

async function main() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.nhw8ipw.mongodb.net/library-db-server?retryWrites=true&w=majority`); 
        server = app.listen(port, () => {
            console.log(`Library Management System App listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

main()