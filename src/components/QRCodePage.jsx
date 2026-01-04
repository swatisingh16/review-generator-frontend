import { QRCodeCanvas } from "qrcode.react";
import "./QRCodePage.css";
import { useRef } from "react";

export default function QRCodePage({ business }) {
  if (!business) return null; // 🛑 safety

  const reviewUrl = `${window.location.origin}/review/${business.id}`;
  const qrRef = useRef(null);

  /* ✅ Copy link */
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewUrl);
      alert("Link copied!");
    } catch {
      alert("Failed to copy link");
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${business.name}-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const printQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank", "width=400,height=400");

    printWindow.document.write(`
    <html>
      <head>
        <title>Print QR</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          img {
            width: 220px;
            height: 220px;
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="qr-wrapper">
      {/* LEFT */}
      <div className="qr-left">
        <p className="share-text">
          Share the link with your customer via email or SMS
        </p>

        <div className="link-box">
          <input value={reviewUrl} readOnly />
          <button onClick={copyLink}>Copy Link</button>
        </div>

        <h3>QR Code</h3>
        <button className="pill-btn">QR Code with name and logo</button>

        <div className="qr-actions">
          <button onClick={downloadQR}>Download QR</button>
          <button onClick={printQR}>Print QR</button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="qr-right">
        <div className="qr-box" ref={qrRef}>
          <QRCodeCanvas value={reviewUrl} size={220} />

          {business.logo && (
            <img src={business.logo} className="qr-logo" alt="logo" />
          )}
        </div>

        <h2 className="qr-business-name">{business.name}</h2>

        <p className="qr-desc">
          Scan the QR Code. Answer simple questions to generate review. Copy and
          paste the review.
        </p>

        <p className="qr-footer">tapitkardz AI Review</p>
      </div>
    </div>
  );
}
