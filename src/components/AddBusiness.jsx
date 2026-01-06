import "./AddBusiness.css";
import { useState, useEffect } from "react";
import { FiCamera } from "react-icons/fi";

export default function AddBusiness({ onSave, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      type: "",
      keywords: "",
      city: "",
      state: "",
      address: "",
      email: "",
      reviewLink: "",
      website: "",
      phone: "",
      about: "",
    }
  );
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      const fullLogoUrl = initialData.logo
        ? `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${
            initialData.logo
          }`
        : null;

      setLogoPreview(fullLogoUrl);

      const langsFromDb = initialData.languages || [];
      const normalized = Array.isArray(langsFromDb)
        ? langsFromDb
        : typeof langsFromDb === "string"
        ? JSON.parse(langsFromDb)
        : [];

      setSelectedLangs(normalized);

      setForm({
        name: initialData.name || "",
        type: initialData.type || "",
        keywords: initialData.keywords || "",
        city: initialData.city || "",
        state: initialData.state || "",
        address: initialData.address || "",
        email: initialData.email || "",
        reviewLink: initialData.reviewLink || "",
        website: initialData.website || "",
        phone: initialData.phone || "",
        about: initialData.about || "",
      });
    }
  }, [initialData]);

  const [selectedLangs, setSelectedLangs] = useState([]);

  const languages = [
    "English",
    "Gujarati",
    "Hindi",
    "Hinglish",
    "Marathi",
    "Hinglish + Marathi",
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = (lang) => {
    setSelectedLangs((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSave = () => {
    if (!form.name || !form.reviewLink) {
      alert("Business name and Google review link are required");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    // Send only selected languages
    formData.append("languages", JSON.stringify(selectedLangs));

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    onSave(formData);
  };

  return (
    <div className="add-business-wrapper">
      <h2 className="add-title">Business Profile</h2>

      <div className="add-business-card">
        <div className="form-left">
          <div className="logo-input-row">
            <label className="logo-upload">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="logo-image" />
              ) : (
                <div className="logo-icon">
                  <FiCamera />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoUpload}
              />
            </label>
            <input
              name="name"
              placeholder="Enter Your Business Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <input
            name="type"
            placeholder="Business type"
            value={form.type}
            onChange={handleChange}
          />

          <input
            name="keywords"
            placeholder="Add Keywords"
            value={form.keywords}
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Mail"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* DIVIDER */}
        <div className="vertical-divider" />

        {/* RIGHT */}
        <div className="form-right">
          <input
            name="reviewLink"
            placeholder="Google review link"
            value={form.reviewLink}
            onChange={handleChange}
          />

          <input
            name="website"
            placeholder="Website"
            value={form.website}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <textarea
            name="about"
            placeholder="About Us"
            value={form.about}
            onChange={handleChange}
          />

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      <div className="horizontal-divider" />

      {/* LANGUAGE SELECTION */}
      <div className="language-row">
        {languages.map((lang) => (
          <button
            key={lang}
            type="button"
            className={`lang-btn ${
              selectedLangs.includes(lang) ? "active" : ""
            }`}
            onClick={() => toggleLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="horizontal-divider" />
      <p className="footer-text">tapitkardz AI Review</p>
    </div>
  );
}
