import { useEffect, useState } from "react";
import "./ReviewGenerator.css";
import { useParams } from "react-router-dom";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const INDIAN_LANGUAGES = [
  "English",
  "Hindi",
  "Hinglish",
  "Gujarati",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Bengali",
  "Urdu",
];

function ReviewGenerator() {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [highlights, setHighlights] = useState("");
  const [tone, setTone] = useState("Positive & Enthusiastic");
  const [lengthLimit, setLengthLimit] = useState("Medium (100-200 chars)");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [availableLanguages] = useState(INDIAN_LANGUAGES);
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/businesses/slug/${slug}`
        );

        if (!res.ok) {
          setMessage("Invalid business link");
          return;
        }

        const biz = await res.json();
        setBusiness(biz);
        setHighlights(biz.keywords || "");

        if (biz.isActive === false) {
          setMessage(
            "Your Tapitkardz AI Review Generator has been deactivated."
          );
        }
      } catch (err) {
        setMessage("Failed to fetch business");
      }
    };

    fetchBusiness();
  }, [slug]);

  const generateReview = async () => {
    if (!business) return;

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

  const openBusinessCard = () => {
    if (!business?.card) {
      setMessage("Business card not available");
      return;
    }
    window.open(business.card, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="review-page">
      <div className="container">
        <div className="card">
          {message && !business?.isActive ? (
            <p className="success-msg">{message}</p>
          ) : (
            <>
              {business && (
                <div className="business-header">
                  {business.logo && (
                    <img
                      src={business.logo}
                      alt={business.name}
                      className="business-logo"
                    />
                  )}
                  <h2 className="business-name">
                    {business.name}{" "}
                    <IoShieldCheckmarkSharp
                      size={16}
                      color="#38B6FF"
                      className="check-mark"
                    />
                  </h2>
                </div>
              )}

              <label>Review Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                <option>Positive & Enthusiastic</option>
                <option>Professional & Formal</option>
                <option>Casual & Friendly</option>
                <option>Funny & Playful</option>
                <option>Constructive Criticism</option>
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

              <label>Select language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="" disabled>
                  Select Language
                </option>

                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>

              <button
                onClick={generateReview}
                className="google-btn"
                disabled={!language || loading }
              >
                {loading ? "Generating..." : "Generate Review"}
              </button>

              {review && (
                <>
                  <textarea
                    className="result-textarea"
                    readOnly
                    value={review}
                  />
                  <button className="google-btn" onClick={leaveGoogleReview}>
                    Copy and Leave Review
                  </button>
                </>
              )}

              {business?.card && (
                <button className="google-btn" onClick={openBusinessCard}>
                  Business card
                </button>
              )}

              {message && business?.isActive && (
                <p className="success-msg">{message}</p>
              )}

              <p className="powered-by">
                Powered by{" "}
                <a
                  href="https://tapitkardz.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="powered-link"
                >
                  tapitkardz
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewGenerator;
