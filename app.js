import express from 'express'
import { PORT } from './config/env.js'
import connectToDatabase from './database/mongodb.js';
import errorMiddlerware from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(errorMiddlerware)

app.get('/', (req, res) => {
   res.send("Welcome to SubApp")
})

app.listen(PORT, async() => {
   console.log(`Server is running on http://localhost:${PORT}`)
   
   await connectToDatabase();
})

export default app;