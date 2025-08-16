import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Notesify - Smart Note Taking & Task Management";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(180deg, #000 0%, #1a1a1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
              borderRadius: 20,
              marginRight: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            📝
          </div>
          <div style={{ fontSize: 72, fontWeight: "bold" }}>Notesify</div>
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Smart note-taking and task management with real-time sync and secure
          authentication
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            gap: 20,
          }}
        >
          <div
            style={{
              background: "#3b82f6",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 18,
            }}
          >
            Free to Use
          </div>
          <div
            style={{
              background: "#059669",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 18,
            }}
          >
            Real-time Sync
          </div>
          <div
            style={{
              background: "#dc2626",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 18,
            }}
          >
            Secure
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
