import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBusiness from "./AddBusiness";
import logo from "../assets/tapit logo.png";
import "./Dashboard.css";
import { FiArrowRight, FiSearch, FiLogOut, FiCamera } from "react-icons/fi";
import QRCodePage from "./QRCodePage";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("list");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalReviewsGenerated: 0,
    totalVisits: 0,
  });

  const handleSidebarAction = (action) => {
    if (action === "dashboard") {
      setActiveView("list");
      setSelectedBusiness(null);
      setShowAddBusiness(false);
    }

    if (action === "qr") {
      setActiveView("qr");
    }

    setSidebarOpen(false);
  };

  const fetchStats = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/businesses/stats/dashboard`
    );
    const data = await res.json();
    setStats(data);
  };

  const fetchBusinesses = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/businesses`);
    const data = await res.json();
    setBusinesses(data);
    console.log(data);
  };

  useEffect(() => {
    fetchBusinesses();
    fetchStats();
  }, []);

  const handleSaveBusiness = async (formData) => {
    const url = editingBusiness
      ? `${import.meta.env.VITE_API_BASE_URL}/businesses/${editingBusiness._id}`
      : `${import.meta.env.VITE_API_BASE_URL}/businesses`;

    const res = await fetch(url, {
      method: editingBusiness ? "PUT" : "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to save business");
      return;
    }

    toast.success(
      editingBusiness
        ? "Business updated successfully"
        : "Business added successfully"
    );

    setShowAddBusiness(false);
    setEditingBusiness(null);
    fetchBusinesses();
  };

  const filteredBusinesses = businesses.filter((biz) =>
    biz.name.toLowerCase().includes(search.toLowerCase())
  );

  const copyReviewLink = async (biz) => {
    const reviewLink = `${window.location.origin}/review/${biz.slug}`;

    try {
      await navigator.clipboard.writeText(reviewLink);
      toast.success("Review link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const openDeleteModal = (biz) => {
    setBusinessToDelete(biz);
    setShowDeleteModal(true);
  };

  const confirmDeleteBusiness = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/businesses/${
          businessToDelete._id
        }`,
        { method: "DELETE" }
      );

      toast.success("Business deleted successfully");
      fetchBusinesses();
    } catch (err) {
      toast.error("Failed to delete business");
    } finally {
      setShowDeleteModal(false);
      setBusinessToDelete(null);
    }
  };

  const toggleStatus = async (biz) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/businesses/${biz._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !biz.isActive,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Status update failed");
      }

      toast.success(
        biz.isActive ? "Business deactivated" : "Business activated"
      );

      fetchBusinesses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update business status");
    }
  };

  return (
    <div className="dashboard-page">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
          ✕
        </button>

        <h2 className="logo">tapitkardz AI Review</h2>

        <div className="profile">
          <img src={logo} alt="logo" className="avatar" />
          <span className="name">tapitkardz</span>
        </div>

        <nav className="menu">
          <button
            className="menu-item"
            onClick={() => handleSidebarAction("dashboard")}
          >
            <span>Dashboard</span>
            <span className="arrow-circle">
              <FiArrowRight />
            </span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleSidebarAction("qr")}
          >
            <span>QR Code</span>
            <span className="arrow-circle">
              <FiArrowRight />
            </span>
          </button>

          <button className="menu-item" onClick={() => setSidebarOpen(false)}>
            <span>Business Profile</span>
            <span className="arrow-circle">
              <FiArrowRight />
            </span>
          </button>

          <button className="menu-item" onClick={() => setSidebarOpen(false)}>
            <span>Terms & Conditions</span>
            <span className="arrow-circle">
              <FiArrowRight />
            </span>
          </button>

          <button className="menu-item" onClick={() => setSidebarOpen(false)}>
            <span>Settings</span>
            <span className="arrow-circle">
              <FiArrowRight />
            </span>
          </button>
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
        <div className="mobile-header">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>

          <h3 className="mobile-title">tapitkardz AI Review</h3>

          <button
            className="mobile-logout"
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              navigate("/login");
            }}
            aria-label="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
        <div className="stats-wrapper">
          <div className="stat">
            <p>Total Businesses</p>
            <h3>{stats.totalBusinesses}</h3>
          </div>
          <span className="divider" />
          <div className="stat">
            <p>Total Review Generate</p>
            <h3>{stats.totalVisits}</h3>
          </div>
          <span className="divider" />
          <div className="stat">
            <p>Token</p>
            <h3>{stats.totalReviewsGenerated}</h3>
          </div>
        </div>

        {activeView === "list" && (
          <>
            {showAddBusiness ? (
              <div className="add-business-scroll">
                <AddBusiness
                  onSave={handleSaveBusiness}
                  initialData={editingBusiness}
                />
              </div>
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
                <div className="business-list">
                  {filteredBusinesses.map((biz) => (
                    <div key={biz._id} className="business-card">
                      <div className="biz-left">
                        {biz.logo ? (
                          <img src={biz.logo} alt={biz.name} />
                        ) : (
                          <div className="logo-icon">
                            <FiCamera />
                          </div>
                        )}
                        <input
                          value={biz.name}
                          readOnly
                          title={biz.name}
                          data-fullname={biz.name}
                        />
                      </div>

                      <div className="biz-actions">
                        <span className="biz-date">
                          {new Date(biz.createdAt).toLocaleDateString("en-GB")}
                        </span>

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

                        <button
                          className="delete-btn"
                          onClick={() => openDeleteModal(biz)}
                        >
                          <MdDelete size={20} />
                        </button>

                        <div className="status-toggle">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={biz.isActive}
                              onChange={() => toggleStatus(biz)}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeView === "qr" && (
          <div className="qr-scroll">
            <QRCodePage business={selectedBusiness} />
          </div>
        )}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="confirm-modal">
              <h3>Delete Business</h3>
              <p>
                Are you sure you want to delete{" "}
                <strong>{businessToDelete?.name}</strong>?
                <br />
                This action cannot be undone.
              </p>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-delete-btn"
                  onClick={confirmDeleteBusiness}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
