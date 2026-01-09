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

    try {
      const blob = await htmlToImage.toBlob(qrRef.current);

      if (!blob) throw new Error("Blob generation failed");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${business.name}-qr.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success("Downloaded QR!");
    } catch (e) {
      toast.error("Download not supported on this device");
    }
  };

  const printQR = async () => {
    if (!qrRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(qrRef.current);

      // Mobile-safe: open image only
      const win = window.open();
      win.document.write(`<img src="${dataUrl}" style="width:100%" />`);
      win.document.close();
    } catch (err) {
      toast.error("Printing not supported on mobile. Please download instead.");
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
