import express, { Application, Request, Response } from 'express'
import { bookRoutes } from './app/controllers/bookControllers';
import { borrowRoutes } from './app/controllers/borrowControllers';
const app: Application = express()

app.use(express.json());


app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);



app.get('/', (req: Request, res: Response) => {
    res.send('Library Management System Is Running......!')
})



export default app;