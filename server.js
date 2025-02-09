const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let chatSession = model.startChat({ history: [] });

app.post("/chat", async (req, res) => {
    try {
        const { userMessage } = req.body;
        const response = await chatSession.sendMessage(userMessage);

        res.json({ botReply: response.response.text() });
    } catch (error) {
        console.error("Error fetching response from Gemini API:", error);
        res.status(500).json({ error: "Failed to fetch response from Gemini AI" });
    }
});

// Reset chat session
app.post("/new-chat", (req, res) => {
    chatSession = model.startChat({ history: [] }); // Start fresh session
    res.json({ message: "New chat session started" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
