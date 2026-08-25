import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3ece0",
          color: "#1c1611",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 6,
            width: 96,
            background: "#c2471a",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 88,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              fontStyle: "italic",
            }}
          >
            lucky
          </div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            kevwoda
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "#5c5348",
              maxWidth: 760,
            }}
          >
            Research and thoughts.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8a7f70",
          }}
        >
          <span>{site.legalName}</span>
          <span>Field journal</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
