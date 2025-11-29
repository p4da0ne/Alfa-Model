// src/components/FloatingOrb.jsx
export default function FloatingOrb({ top, left, delay = 0 }) {
  return (
    <div
      className="floating-orb"
      style={{
        top,
        left,
        animationDelay: `${delay}s`
      }}
    />
  );
}

