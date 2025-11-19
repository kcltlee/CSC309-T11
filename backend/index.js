import express from "express";
import routes from "./routes.js";
import dotenv from "dotenv";
// TODO: complete me (loading the necessary packages)

// allow API endpoint to access from other domain
import cors from 'cors'

// TODO: complete me (CORS)

dotenv.config(); // loads FRONTEND_URL from .env

console.log("frontend url:", process.env.FRONTEND_URL)

const app = express();

// allow this origin from frontend
app.use(cors( {
    origin: process.env.FRONTEND_URL,  // e.g. "http://localhost:5173"
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());


app.use(express.json());
app.use('', routes);



export default app;