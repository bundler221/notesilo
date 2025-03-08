import { pipeline } from "@xenova/transformers";

// Cache pipeline so model loads only once
let summarizer = null;

export default async function summarizeText(text) {   // ✅ named export
  try {
    if (!summarizer) {
      summarizer = await pipeline("summarization", "Xenova/bart-large-cnn");
    }

    const result = await summarizer(text, {
      max_length: 100,
      min_length: 30,
      do_sample: false,
    });

    return result[0].summary_text;
  } catch (error) {
    console.error("Summarization error:", error);
    return "⚠️ Summarization failed.";
  }
}
