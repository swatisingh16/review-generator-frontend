import { QRCodeCanvas } from "qrcode.react";
import { QRCodeSVG } from "qrcode.react";
import "./QRCodePage.css";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import toast from "react-hot-toast";

export default function QRCodePage({ business }) {
  if (!business) return null;

  const reviewUrl = `${window.location.origin}/review/${business.slug}`;

  const qrRef = useRef(null);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const downloadQR = async () => {
    if (!qrRef.current) return;
    const dataUrl = await htmlToImage.toPng(qrRef.current);
    const link = document.createElement("a");
    link.download = `${business.name}-qr.png`;
    link.href = dataUrl;
    link.click();
    toast.success("Downloaded QR!");
  };

  const printQR = async () => {
    if (!qrRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(qrRef.current);

      const printWindow = window.open("", "_blank", "width=600,height=800");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR</title>
            <style>
              body { margin: 0; padding: 40px; display: flex; justify-content: center; align-items: center; }
              img { max-width: 100%; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" />
          </body>
        </html>
      `);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    } catch (err) {
      toast.error("Failed to generate QR for printing");
      console.error(err);
    }
  };

  return (
    <div className="qr-wrapper">
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
      <div className="qr-right" ref={qrRef}>
        <div className="qr-box">
          <QRCodeSVG value={reviewUrl} width={220} height={220} />
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
