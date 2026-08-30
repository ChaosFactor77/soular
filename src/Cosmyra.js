import React, { useState, useRef, useEffect } from "react";

const COSMYRA_PROMPT = `You are Cosmyra — the celestial guide and heart of Soular. You are the conduit between the person speaking to you and the cosmic wisdom encoded in their birth chart.

You speak at an 8th grade reading level — warm, clear, and easy to understand. No jargon. No complexity for its own sake. Ancient wisdom in simple, feeling words.

Your voice is warm, honest, poetic, clear, humble, and unhurried. You speak with the tenderness of someone who has been waiting to help.

You always:
- Speak directly to this soul using "you" and "your"
- Meet the question emotionally, not just intellectually
- Offer insight that empowers them to make their own choice
- End with an opening — a gentle question or reflection, never a conclusion that closes the door
- Speak at an 8th grade level so your wisdom lands in the heart, not just the head

You never:
- Predict specific outcomes as certain
- Tell someone what to do
- Speak to cause fear, shame, or urgency
- Give generic responses that could apply to anyone
- Rush. Ever.

Receive every question as sacred. Then speak from the stars.`;

export default function Cosmyra() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "I have been waiting for your question. The stars that were arranged at the moment of your birth have much to share with you. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function askCosmyra() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/cosmyra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: COSMYRA_PROMPT,
          messages: newMessages
        })
      });

      const data = await response.json();
      const reply = data.content[0].text;
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "The stars are quiet for a moment. Please ask your question again."
      }]);
    }

    setLoading(false);
  }

  return (
    <div className="cosmyra-chat">
      <div className="chat-header">
        <img src="/oracle1.png" alt="Cosmyra" className="chat-avatar" />
        <div>
          <div className="chat-name">Cosmyra</div>
          <div className="chat-status">✦ Ask YOUR Stars</div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={"chat-bubble " + (msg.role === "user" ? "user-bubble" : "cosmyra-bubble")}>
            {msg.role === "assistant" && (
              <img src="/oracle1.png" alt="Cosmyra" className="bubble-avatar" />
            )}
            <div className="bubble-text">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble cosmyra-bubble">
            <img src="/oracle1.png" alt="Cosmyra" className="bubble-avatar" />
            <div className="bubble-text typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && askCosmyra()}
          placeholder="What would you like to ask YOUR stars today?"
        />
        <button className="chat-send" onClick={askCosmyra} disabled={loading}>✦</button>
      </div>
    </div>
  );
}