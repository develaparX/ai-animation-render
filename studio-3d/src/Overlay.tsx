import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

export interface WordItem {
  word: string;
  start: number;
  end: number;
}

interface OverlayProps {
  t: number;
  words: WordItem[];
  hookHeadline: string;
  ctaHeadline: string;
  ctaStart: number;
  telemetryLabel: string;
  telemetryValue: string;
  telemetrySub: string;
  alarm?: boolean;
  flashWhite?: number;
  dropletOpacity?: number;
}

const DROPLETS = [
  { x: 12, y: 14, r: 8 }, { x: 83, y: 19, r: 11 }, { x: 27, y: 34, r: 7 },
  { x: 66, y: 26, r: 10 }, { x: 44, y: 45, r: 12 }, { x: 88, y: 54, r: 8 },
  { x: 17, y: 62, r: 9 }, { x: 74, y: 71, r: 11 }, { x: 52, y: 17, r: 6 },
];

export const EditorialOverlay: React.FC<OverlayProps> = ({
  t,
  words,
  hookHeadline,
  ctaHeadline,
  ctaStart,
  telemetryLabel,
  telemetryValue,
  telemetrySub,
  alarm = false,
  flashWhite = 0,
  dropletOpacity = 0,
}) => {
  const chunks: WordItem[][] = [];
  for (let i = 0; i < words.length; i += 5) chunks.push(words.slice(i, i + 5));
  const activeChunk =
    chunks.find((ch) => t >= ch[0].start - 0.1 && t <= ch[ch.length - 1].end + 0.35) ?? null;

  const hookOpacity =
    t < 3.6 ? interpolate(t, [0, 0.25, 2.9, 3.6], [0, 1, 1, 0], { extrapolateRight: "clamp" }) : 0;
  const ctaOpacity =
    t >= ctaStart ? interpolate(t, [ctaStart, ctaStart + 0.6], [0, 1], { extrapolateRight: "clamp" }) : 0;

  return (
    <>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 45%, transparent 45%, rgba(2, 6, 14, 0.56) 100%)",
        }}
      />

      {flashWhite > 0.01 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            backgroundColor: `rgba(255, 252, 240, ${Math.min(0.95, flashWhite)})`,
          }}
        />
      )}

      {dropletOpacity > 0.02 && (
        <AbsoluteFill style={{ opacity: dropletOpacity, pointerEvents: "none" }}>
          {DROPLETS.map((d, i) => {
            const slide = (t * (1.6 + (i % 3) * 0.6)) % 10;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${d.x}%`,
                  top: `${d.y + slide}%`,
                  width: d.r * 2,
                  height: d.r * 2.4,
                  borderRadius: "50% 50% 46% 46%",
                  border: "1.5px solid rgba(255,255,255,0.42)",
                  background:
                    "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.34), rgba(255,255,255,0.06))",
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}

      {/* Minimal editorial left telemetry */}
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 500,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: "#ffffff",
          textShadow: "0 2px 14px rgba(0,0,0,0.88)",
        }}
      >
        <div
          style={{
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 3.1,
            color: "rgba(255,255,255,0.86)",
            marginBottom: 4,
          }}
        >
          {telemetryLabel}
        </div>
        <div style={{ fontSize: 48, fontWeight: 400, lineHeight: 1.04, fontVariantNumeric: "tabular-nums" }}>
          {telemetryValue}
        </div>
        <div
          style={{
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 2.5,
            color: alarm ? "#fde68a" : "rgba(255,255,255,0.8)",
            marginTop: 7,
          }}
        >
          {telemetrySub}
        </div>
      </div>

      {/* Opening editorial headline */}
      {hookOpacity > 0.02 && (
        <div
          style={{
            position: "absolute",
            top: 195,
            left: 50,
            right: 50,
            textAlign: "center",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 42,
            lineHeight: 1.24,
            color: "#ffffff",
            opacity: hookOpacity,
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
          }}
        >
          {hookHeadline}
        </div>
      )}

      {/* Italic editorial captions synced to speech */}
      {activeChunk && (
        <div
          style={{
            position: "absolute",
            bottom: 225,
            left: 46,
            right: 46,
            textAlign: "center",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: 32,
            lineHeight: 1.35,
            textShadow: "0 3px 16px rgba(0,0,0,0.96), 0 1px 4px rgba(0,0,0,0.96)",
          }}
        >
          {activeChunk.map((w, idx) => {
            const active = t >= w.start - 0.04 && t <= w.end + 0.08;
            return (
              <span
                key={idx}
                style={{
                  color: active ? "#fef08a" : "#ffffff",
                  marginRight: 8,
                }}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      )}

      {ctaOpacity > 0.03 && (
        <div
          style={{
            position: "absolute",
            top: 220,
            left: 52,
            right: 52,
            textAlign: "center",
            opacity: ctaOpacity,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 34,
            lineHeight: 1.3,
            color: "#ffffff",
            textShadow: "0 4px 20px rgba(0,0,0,0.92)",
          }}
        >
          {ctaHeadline}
        </div>
      )}

      {/* NO watermark — kept fully clean per user request */}
    </>
  );
};
