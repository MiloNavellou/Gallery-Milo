import { useState, useEffect } from "react";

export default function ProjectListOverlay({ projects, onClose, onSelect }) {
  const [hoveredImg, setHoveredImg] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  // --- ANIMATION D'ENTRÉE ---
  useEffect(() => {
    // Petit délai pour assurer la transition CSS
    const timer = setTimeout(() => setActive(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // --- GESTION SOURIS (PC) ---
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // --- FERMETURE ---
  const handleClose = () => {
    setActive(false);
    setTimeout(onClose, 600);
  };

  // --- CLIC PROJET ---
  const handleProjectClick = (item) => {
    handleClose();
    setTimeout(() => {
      onSelect(item);
    }, 300);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="project-list-container"
      style={{
        // FIX MOBILE : Positionnement explicite (plus robuste que inset: 0)
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        
        backgroundColor: "white",
        color: "black",
        
        // Z-INDEX SUPÉRIEUR : Doit être > 999 999 (bouton mobile)
        zIndex: 2000000, 
        
        cursor: "default",
        
        // FIX SCROLL MOBILE
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        
        /* Animation - Utilisation de translate3d pour forcer l'accélération GPU sur mobile */
        transform: active ? "translate3d(0, 0, 0)" : "translate3d(0, 100%, 0)",
        transition: "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      {/* BOUTON FERMER */}
      <button className="close-btn" onClick={handleClose}>
        Close
      </button>

      {/* TITRE */}
      <div className="project-header-row">
        <h1 className="project-title-main">
          MY PROJECTS
        </h1>
      </div>

      {/* LISTE DES PROJETS */}
      <div className="project-list-wrapper">
        {projects.map((item) => (
          <div
            key={item.id}
            className="project-row"
            // Les événements souris pour le Desktop sont conservés
            onMouseEnter={() => setHoveredImg(item.url)}
            onMouseLeave={() => setHoveredImg(null)}
            onClick={() => handleProjectClick(item)}
            style={{
              color: hoveredImg === item.url ? "#862222" : "black",
            }}
          >
            {/* Année */}
            <span className="col-year">{item.year || "2025"}</span>

            {/* Titre */}
            <span className="col-title">{item.title}</span>

            {/* Client */}
            <span className="col-client">{item.client || "IUT Lannion"}</span>

            {/* Lien */}
            <span className="col-link">Discover project ↗</span>
          </div>
        ))}
      </div>

      {/* IMAGE FLOTTANTE (Desktop uniquement - géré via CSS media query) */}
      {hoveredImg && (
        <div
          className="floating-preview"
          style={{
            left: mousePos.x,
            top: mousePos.y,
          }}
        >
          <img
            src={hoveredImg}
            alt="preview"
            className="floating-img"
          />
        </div>
      )}
    </div>
  );
}