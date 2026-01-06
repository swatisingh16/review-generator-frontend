import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBusiness from "./AddBusiness";
import logo from "../assets/tapit logo.png";
import "./Dashboard.css";
import { FiArrowRight, FiSearch, FiLogOut, FiCamera } from "react-icons/fi";
import QRCodePage from "./QRCodePage";

export default function Dashboard() {
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("list");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [editingBusiness, setEditingBusiness] = useState(null);

  const fetchBusinesses = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/businesses`);
    const data = await res.json();
    setBusinesses(data);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSaveBusiness = async (formData) => {
    const url = editingBusiness
      ? `${import.meta.env.VITE_API_BASE_URL}/businesses/${editingBusiness._id}`
      : `${import.meta.env.VITE_API_BASE_URL}/businesses`;

    await fetch(url, {
      method: editingBusiness ? "PUT" : "POST",
      body: formData,
    });

    setShowAddBusiness(false);
    setEditingBusiness(null);
    fetchBusinesses();
  };

  const filteredBusinesses = businesses.filter((biz) =>
    biz.name.toLowerCase().includes(search.toLowerCase())
  );

  const copyReviewLink = async (biz) => {
    const reviewLink = `${window.location.origin}/review/${biz._id}`;

    try {
      await navigator.clipboard.writeText(reviewLink);
      alert("Review link copied!");
    } catch (err) {
      alert("Failed to copy link");
    }
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2 className="logo">tapitkardz AI Review</h2>

        <div className="profile">
          <img src={logo} alt="logo" className="avatar" />
          <span className="name">tapitkardz</span>
        </div>

        <nav className="menu">
          {[
            "Dashboard",
            "QR Code",
            "Business Profile",
            "Terms & Conditions",
            "Settings",
          ].map((item) => (
            <button key={item} className="menu-item">
              <span>{item}</span>
              <span className="arrow-circle">
                <FiArrowRight />
              </span>
            </button>
          ))}
        </nav>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            navigate("/login");
          }}
        >
          <FiLogOut /> log out
        </button>
      </aside>

      <main className="content">
        <div className="stats-wrapper">
          <div className="stat">
            <p>Total Visit</p>
            <h3>0</h3>
          </div>
          <span className="divider" />
          <div className="stat">
            <p>Total Review Generate</p>
            <h3>0</h3>
          </div>
          <span className="divider" />
          <div className="stat">
            <p>Token</p>
            <h3>0</h3>
          </div>
        </div>

        {activeView === "list" && (
          <>
            {showAddBusiness ? (
              <AddBusiness
                onSave={handleSaveBusiness}
                initialData={editingBusiness}
              />
            ) : (
              <>
                <div className="search-row">
                  <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input
                      placeholder="Search by Business name"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button
                    className="add-btn"
                    onClick={() => setShowAddBusiness(true)}
                  >
                    Add Business
                  </button>
                </div>

                {filteredBusinesses.map((biz) => (
                  <div key={biz._id} className="business-card">
                    <div className="biz-left">
                      {biz.logo ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL.replace(
                            "/api",
                            ""
                          )}${biz.logo}`}
                          alt={biz.name}
                        />
                      ) : (
                        <div className="logo-icon">
                          <FiCamera />
                        </div>
                      )}
                      <input value={biz.name} readOnly />
                    </div>

                    <div className="biz-actions">
                      <button onClick={() => copyReviewLink(biz)}>
                        Copy Link
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBusiness(biz);
                          setActiveView("qr");
                        }}
                      >
                        Download QR
                      </button>
                      <button
                        onClick={() => {
                          setEditingBusiness(biz);
                          setShowAddBusiness(true);
                        }}
                      >
                        Edit profile
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {activeView === "qr" && <QRCodePage business={selectedBusiness} />}
      </main>
    </div>
  );
}
