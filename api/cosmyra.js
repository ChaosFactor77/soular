import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_KEY
  });

  try {
    const { messages, system } = req.body;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: system,
      messages: messages
    });

    res.status(200).json({ content: response.content });
  } catch (error) {
    console.error("Cosmyra error:", error);
    res.status(500).json({ error: "The stars are quiet. Please try again." });
  }
}