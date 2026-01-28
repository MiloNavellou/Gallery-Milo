import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export default function LoaderScreen() {
  const { progress } = useProgress();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Si le chargement atteint 100%
    if (progress === 100) {
      // On attend un tout petit peu (500ms) pour que l'utilisateur voie "100%"
      // avant de déclencher l'animation de sortie
      const timer = setTimeout(() => {
        setFinished(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div className={`loader-container ${finished ? "loader-hidden" : ""}`}>
      {/* GROS CHIFFRE */}
      <div className="loader-percent">
        {progress.toFixed(0)}%
      </div>
      
      {/* TEXTE SUBTIL */}
      <div className="loader-text">
        Chargement de la galerie
      </div>

      {/* BARRE DE PROGRESSION EN BAS */}
      <div className="loader-bar-bg">
        <div 
          className="loader-bar-fill" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}