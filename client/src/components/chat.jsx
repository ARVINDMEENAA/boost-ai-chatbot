import { useEffect, useRef, useState } from "react";

function Chat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;

    const userPrompt = prompt;

    setPrompt("");
    setLoading(true);

    // User Message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userPrompt,
      },
    ]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "20px auto",
        padding: "15px",
        boxSizing: "border-box",
      }}
    >
      <img
        src="/robot-assistant.png"
        alt="AI Logo"
        style={{
          width: "70px",
          display: "block",
          margin: "0 auto 10px",
        }}
      />

      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        🤖 Boost AI Chatbot
      </h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          height: "65vh",
          minHeight: "400px",
          maxHeight: "700px",
          overflowY: "auto",
          padding: "15px",
          marginBottom: "20px",
          background: "#fafafa",
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "gray",
            }}
          >
            👋 Hello! Ask me anything.
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  background:
                    msg.role === "user" ? "#007bff" : "#e5e5ea",
                  color:
                    msg.role === "user" ? "#fff" : "#000",
                  padding: "12px",
                  borderRadius: "12px",
                  maxWidth: "85%",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                <strong>
                  {msg.role === "user"
                    ? "🧑 You"
                    : "🤖 AI"}
                </strong>

                <p
                  style={{
                    margin: "8px 0 0",
                    lineHeight: "1.6",
                  }}
                >
                  {msg.text}
                </p>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                background: "#e5e5ea",
                padding: "12px",
                borderRadius: "12px",
                maxWidth: "85%",
              }}
            >
              🤖 Thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "100%",
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={prompt}
          disabled={loading}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          style={{
            flex: 1,
            padding: "14px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: "0 22px",
            border: "none",
            borderRadius: "8px",
            background: "#007bff",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;