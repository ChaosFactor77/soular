export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    
    const apiKey = process.env.ANTHROPIC_KEY;
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: req.body.system,
        messages: req.body.messages
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ 
        error: "The stars are quiet for a moment. Please ask your question again.",
        details: data.error.message
      });
    }

    res.status(200).json({ content: data.content });
  } catch (error) {
    res.status(500).json({ 
      error: "The stars are quiet for a moment. Please ask your question again.",
      details: error.message 
    });
  }
}