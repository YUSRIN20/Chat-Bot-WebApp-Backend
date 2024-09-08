import express, { text } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAvatar } from "./Controllers/getAvatar.js";
import { generateChatContent } from "./Controllers/generateChat.js";
import { generateAvatarVideoContent, getGeneratedAvatarVideo } from "./Controllers/generateAvatarVideo.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;



// Getting Avatar Api
app.get("/api/avatars",getAvatar)

// For Avatar generate Api
app.post("/api/generate", generateAvatarVideoContent)
app.get('/api/video-status/:videoId',getGeneratedAvatarVideo)


// For content-generate Api
app.post("/api/generate-content",generateChatContent)

// Listening App
app.listen(port, () => {
    console.log(`App Running on port ${port}`);
});
