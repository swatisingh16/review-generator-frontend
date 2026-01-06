import logo from "../assets/tapit logo.png";
import "./BusinessList.css";

export default function BusinessList({ businesses }) {
  return (
    <div className="business-list-page">
      {businesses.map((biz) => (
        <div key={biz._id} className="business-card">
          <div className="biz-left">
            <img src={logo} alt="logo" />
            <input value={biz.name} readOnly />
          </div>

          <div className="biz-actions">
            <button
              onClick={() => navigator.clipboard.writeText(biz.link)}
            >
              Copy Link
            </button>

            <button onClick={() => alert("QR coming soon")}>
              Download QR
            </button>

            <button onClick={() => alert("Edit profile coming soon")}>
              Edit profile
            </button>
          </div>
        </div>
      ))}

      {businesses.length === 0 && (
        <p>No businesses added yet</p>
      )}
    </div>
  );
}
