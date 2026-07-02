import express from "express";
import cors from "cors";
import chatRoute from "./routes/chatRoute.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoute);

// Test Route
app.get("/", (req, res) => {
    res.send("AI Chatbot Backend Running 🚀");
});

export default app;