// notesFeaturesRoutes.js
const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.use(bodyParser.json());

// --- Summarize Note ---
router.post("/summarize", async (req, res) => {
  try {
    const { content } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes notes." },
        { role: "user", content: `Summarize this note:\n\n${content}` },
      ],
    });

    res.json({ summary: completion.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Generate Study Questions ---
router.post("/questions", async (req, res) => {
  try {
    const { content } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates study questions from notes." },
        { role: "user", content: `Generate 5 study questions from this note:\n\n${content}` },
      ],
    });

    const questions = completion.choices[0].message.content
      .trim()
      .split("\n")
      .filter((q) => q);

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- User Questions on Notes ---
router.post("/user-questions", async (req, res) => {
  try {
    const { content, question } = req.body;

    if (!question || !content) {
      return res.status(400).json({ error: "Both 'content' and 'question' are required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that answers questions based on notes content." },
        { role: "user", content: `Note:\n${content}\n\nQuestion:\n${question}` },
      ],
    });

    const answer = completion.choices[0].message.content.trim();
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
