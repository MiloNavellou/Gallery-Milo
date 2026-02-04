import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export default function LoaderScreen({ onFinished }) { // Ajout de la prop
  const { progress } = useProgress();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setFinished(true);
        // On attend la fin de la transition CSS (1.2s dans votre CSS)
        // pour prévenir App.jsx que l'intro peut apparaître
        setTimeout(() => {
          if (onFinished) onFinished();
        }, 1200); 
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onFinished]);

  return (
    <div className={`loader-container ${finished ? "loader-hidden" : ""}`}>
      <div className="loader-percent">{progress.toFixed(0)}%</div>
      <div className="loader-text">Chargement de la galerie</div>
      <div className="loader-bar-bg">
        <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}