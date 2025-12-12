import { useState } from "react";
import "./App.css";

function App() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [tone, setTone] = useState("Positive & Enthusiastic");
  const [lengthLimit, setLengthLimit] = useState("Medium (100-200 chars)");
  const [highlights, setHighlights] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const GOOGLE_REVIEW_LINK = "https://g.page/r/CTtjt7R1XI_zEBM/review";

  const generateReview = async () => {
    if (!businessName || !businessType) {
      alert("Please fill Business Name and Business Type");
      return;
    }

    setLoading(true);
    setReview("");

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const res = await fetch(`${API_URL}/generate-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          businessType,
          tone,
          lengthLimit,
          highlights,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Error generating review: " + data.error);
      } else {
        setReview(data.review);
      }

    } catch (err) {
      alert("Error connecting to backend: " + err.message);
    }

    setLoading(false);
  };

  const leaveGoogleReview = async () => {
    if (!review) {
      alert("Generate a review first!");
      return;
    }

    try {
      await navigator.clipboard.writeText(review);
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = review;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    alert("Review copied! Redirecting you to Google Reviews...");

    window.open(GOOGLE_REVIEW_LINK, "_blank");
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">AI Review Generator</h2>

        <label>Business Name</label>
        <input
          type="text"
          placeholder="e.g., The Coffee Nook"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <label>Business Type</label>
        <input
          type="text"
          placeholder="e.g., Cafe, Mechanic, Dentist"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
        />

        <label>Review Tone</label>
        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option>Positive & Enthusiastic</option>
          <option>Professional & Formal</option>
          <option>Casual & Friendly</option>
          <option>Funny & Playful</option>
        </select>

        <label>Length Limit (Characters)</label>
        <select
          value={lengthLimit}
          onChange={(e) => setLengthLimit(e.target.value)}
        >
          <option>Short (50-100 chars)</option>
          <option>Medium (100-200 chars)</option>
          <option>Long (200-400 chars)</option>
        </select>

        <label>Key Highlights (Optional)</label>
        <textarea
          placeholder="e.g., Good service, friendly staff"
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
        ></textarea>

        <button onClick={generateReview} disabled={loading}>
          {loading ? "Generating..." : "Generate Review"}
        </button>

        {review && (
          <div className="result-box">
            <h3>Generated Review</h3>
            <p>{review}</p>

            <button className="google-btn" onClick={leaveGoogleReview}>
              Copy & Leave Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
