import { ImageResponse } from "next/og";

export const alt = "MS Rent, location de voitures à Yverdon-les-Bains";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0c0e12", color: "#fff", padding: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 84, height: 84, borderRadius: 18, background: "#fff", color: "#0c0e12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 800 }}>MS</div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 8 }}>RENT</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Louez votre voiture simplement.</div>
          <div style={{ fontSize: 34, color: "rgba(255,255,255,0.65)", marginTop: 24 }}>Location de voitures à Yverdon-les-Bains · Réservation par WhatsApp</div>
        </div>
      </div>
    ),
    size,
  );
}
