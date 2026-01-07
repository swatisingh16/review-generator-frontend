import { useState, useEffect } from "react";
import "./ReviewGenerator.css";
import { useParams } from "react-router-dom";

function ReviewGenerator() {
  // const [businessName, setBusinessName] = useState("Trimurti Garden & Banquets");
  // const [businessType, setBusinessType] = useState("Banquet Hall & Event Venue");
  const { businessId } = useParams();
  console.log(businessId);
  const [business, setBusiness] = useState(null);
  const [highlights, setHighlights] = useState("");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Positive & Enthusiastic");
  const [lengthLimit, setLengthLimit] = useState("Medium (100-200 chars)");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [availableLanguages, setAvailableLanguages] = useState([]);

  useEffect(() => {
    const fetchBusiness = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/businesses/${businessId}`
      );

      if (!res.ok) {
        setMessage("Invalid business link");
        return;
      }

      const biz = await res.json();
      setBusiness(biz);
      setHighlights(biz.keywords || "");

      const langs = biz.languages?.length > 0 ? biz.languages : ["English"];

      setAvailableLanguages(langs);
      setLanguage(langs[0]);
    };

    fetchBusiness();
  }, [businessId]);

  const generateReview = async () => {
    setLoading(true);
    setReview("");

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/generate-review`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business._id,
          businessName: business.name,
          businessType: business.type,
          tone,
          lengthLimit,
          highlights,
          language,
        }),
      }
    );

    const data = await res.json();
    setReview(data.review);
    setLoading(false);
  };

  const leaveGoogleReview = async () => {
    if (!review) {
      setMessage("Please generate a review first.");
      return;
    }

    await navigator.clipboard.writeText(review);
    setMessage("Review copied! Redirecting to Google Reviews...");

    window.location.href = business.reviewLink;
  };

  return (
    <div className="review-page">
      <div className="container">
        <div className="card">
          {/* Business Header */}
          {business && (
            <div className="business-header">
              {business.logo && (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL.replace(
                    "/api",
                    ""
                  )}${business.logo}`}
                  alt={business.name}
                  className="business-logo"
                />
              )}
              <h2 className="business-name">{business.name}</h2>
            </div>
          )}

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

          <div className="lang-buttons">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`lang-btn ${language === lang ? "active" : ""}`}
                onClick={() => setLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={generateReview}
            className="google-btn"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Review"}
          </button>

          {review && (
            <>
              <textarea className="result-textarea" readOnly value={review} />
              <button className="google-btn" onClick={leaveGoogleReview}>
                Copy and Leave Review
              </button>
            </>
          )}
          {message && <p className="success-msg">{message}</p>}
          <p className="powered-by">tapitkardz AI Review</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewGenerator;
