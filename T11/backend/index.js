import express from "express";
import routes from "./routes.js";
import dotenv from "dotenv";
// TODO: complete me (loading the necessary packages)

// allow API endpoint to access from other domain
import cors from 'cors'

// TODO: complete me (CORS)

dotenv.config(); 

console.log("frontend url:", process.env.FRONTEND_URL)

const app = express();

// allow origin
app.use(cors( {
    origin: process.env.FRONTEND_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());


app.use(express.json());
app.use('', routes);



export default app;