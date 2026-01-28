import React from 'react';

// État partagé pour les contrôles
export const mobileInputs = {
  forward: false,
  backward: false,
};

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function MobileInterface({ onPermissionGranted, hasPermission }) {
  if (!isMobile) return null;

  // 1. Écran de demande de permission
  if (!hasPermission) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        background: "black", color: "white", zIndex: 99999,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        textAlign: "center", padding: "20px"
      }}>
        <h2 style={{ textTransform: "uppercase", marginBottom: "20px" }}>Expérience Immersive</h2>
        <p style={{ marginBottom: "40px", maxWidth: "300px", opacity: 0.7 }}>
          Tournez votre appareil pour regarder autour de vous.
        </p>
        <button
          onClick={async () => {
            if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
              try {
                const response = await DeviceOrientationEvent.requestPermission();
                if (response === "granted") onPermissionGranted();
                else alert("Permission refusée.");
              } catch (e) { console.error(e); }
            } else {
              onPermissionGranted();
            }
          }}
          style={{ background: "white", color: "black", border: "none", padding: "15px 30px", fontWeight: "900", textTransform: "uppercase" }}
        >
          COMMENCER
        </button>
      </div>
    );
  }

  // 2. Boutons de navigation
  return (
    <div style={{
      position: "fixed", bottom: "30px", left: 0, width: "100%",
      display: "flex", justifyContent: "center", gap: "20px", zIndex: 9000,
      userSelect: "none", touchAction: "none",
      // FIX CRITIQUE : Le conteneur laisse passer les clics (pour pouvoir cliquer sur les tableaux)
      pointerEvents: "none" 
    }}>
      <button
        onTouchStart={(e) => { e.preventDefault(); mobileInputs.backward = true; }}
        onTouchEnd={(e) => { e.preventDefault(); mobileInputs.backward = false; }}
        style={{ ...btnStyle, pointerEvents: "auto" }} // Le bouton capture le clic
      >↓</button>
      <button
        onTouchStart={(e) => { e.preventDefault(); mobileInputs.forward = true; }}
        onTouchEnd={(e) => { e.preventDefault(); mobileInputs.forward = false; }}
        style={{ ...btnStyle, pointerEvents: "auto" }} // Le bouton capture le clic
      >↑</button>
    </div>
  );
}

const btnStyle = {
  width: "80px", height: "80px", borderRadius: "50%",
  background: "rgba(255,255,255,0.1)", border: "1px solid white",
  color: "white", fontSize: "24px", display: "flex", justifyContent: "center", alignItems: "center"
};