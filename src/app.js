import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

// Routes
import authRoutes from "./routes/auth.js"
import router from "./routes/events.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/events', router);

app.get('/', (req, res) => {
  res.send('VolunTrack Backend Running');
});

export default app;
