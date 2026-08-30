export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyExists = !!process.env.ANTHROPIC_KEY;
  const keyPreview = process.env.ANTHROPIC_KEY ? process.env.ANTHROPIC_KEY.substring(0, 10) + "..." : "NOT FOUND";

  if (!process.env.ANTHROPIC_KEY) {
    return res.status(500).json({ 
      error: "The stars are quiet for a moment. Please ask your question again.",
      details: "API key not found. Key preview: " + keyPreview
    });
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_KEY
    });

    const { messages, system } = req.body;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: system,
      messages: messages
    });

    res.status(200).json({ content: response.content });
  } catch (error) {
    console.error("Cosmyra error:", error.message);
    res.status(500).json({ 
      error: "The stars are quiet for a moment. Please ask your question again.",
      details: error.message 
    });
  }
}