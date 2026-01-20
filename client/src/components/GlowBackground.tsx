import React from "react";

interface GlowBackgroundProps {
  children: React.ReactNode;
}

export const GlowBackground: React.FC<GlowBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen animated-gradient-bg relative overflow-hidden">
      {/* Floating Glow Orbs */}
      <div className="glow-container">
        <div
          className="glow-orb glow-orb-cyan"
          style={
            {
              top: "-10%",
              left: "-10%",
              animationDelay: "0s",
            } as React.CSSProperties
          }
        />
        <div
          className="glow-orb glow-orb-magenta"
          style={
            {
              bottom: "10%",
              right: "-5%",
              animationDelay: "-5s",
            } as React.CSSProperties
          }
        />
        <div
          className="glow-orb glow-orb-purple"
          style={
            {
              top: "30%",
              left: "60%",
              animationDelay: "-10s",
            } as React.CSSProperties
          }
        />
        <div
          className="glow-orb glow-orb-cyan"
          style={
            {
              bottom: "-10%",
              left: "20%",
              animationDelay: "-15s",
              width: "400px",
              height: "400px",
            } as React.CSSProperties
          }
        />
      </div>

      {/* Global Background Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            height: "100%",
          }}
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
