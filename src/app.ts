import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('api/post', postRoutes)

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Advance API is running"
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});