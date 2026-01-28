import { useState, useEffect } from "react";

export default function ProjectListOverlay({ projects, onClose, onSelect }) {
  const [hoveredImg, setHoveredImg] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  // --- ANIMATION D'ENTRÉE ---
  useEffect(() => {
    requestAnimationFrame(() => setActive(true));
  }, []);

  // --- GESTION SOURIS ---
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
        position: "fixed",
        inset: 0,
        backgroundColor: "white",
        color: "black",
        zIndex: 10000,
        cursor: "default",
        overflowY: "auto",
        /* Animation du panneau */
        transform: active ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      {/* BOUTON FERMER (Style global .close-btn défini dans App.css) */}
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
            onMouseEnter={() => setHoveredImg(item.url)}
            onMouseLeave={() => setHoveredImg(null)}
            onClick={() => handleProjectClick(item)}
            style={{
              // La couleur dynamique reste inline car elle dépend du JS (state react)
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

      {/* IMAGE FLOTTANTE (PREVIEW) */}
      {hoveredImg && (
        <div
          className="floating-preview"
          style={{
            // Position dynamique via JS, le reste est dans le CSS
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