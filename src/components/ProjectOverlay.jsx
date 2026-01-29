import { useState, useEffect } from "react";

export default function ProjectOverlay({ project, onClose }) {
  const [active, setActive] = useState(false);

  // Animation d'entrée
 useEffect(() => {
    // 1. Force immédiate du curseur système
    document.body.style.cursor = "auto";
    
    // 2. Sécurité : Si le verrou est encore actif, on le fait sauter
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }

    requestAnimationFrame(() => setActive(true));
    
    // Cleanup : on remet le curseur auto en partant au cas où
    return () => { document.body.style.cursor = "auto"; };
  }, []);

  // Animation de sortie
  const handleClose = () => {
    setActive(false);
    setTimeout(onClose, 600);
  };

  if (!project) return null;

  return (
    <div className={`fullscreen-overlay ${active ? "active" : ""}`}>
      <button className="close-btn" onClick={handleClose}>
        Close
      </button>

      {/* Colonne d'information (Gauche) */}
      <div className="info-col">
        <div className="header-box">
          <h1 className="project-title">{project.title}</h1>
        </div>

        <div className="desc-box">
          <p>{project.description}</p>
        </div>

        <div className="meta-grid">
          <div className="meta-item">
            <span className="meta-label">Year</span>
            <span className="meta-value">{project.year}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Client</span>
            <span className="meta-value">{project.client}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Technique</span>
            <span className="meta-value">{project.tools}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Credit</span>
            <span className="meta-value">{project.credits}</span>
          </div>
        </div>

        {project.link && (
          <div className="action-box">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="figma-btn"
            >
              <span>View Project</span>
              <span className="arrow-icon">→</span>
            </a>
          </div>
        )}
      </div>

      {/* Colonne Image (Droite) */}
      <div className="image-col">
        <img
          src={project.url}
          alt={project.title}
          className="project-image-full"
        />
      </div>
    </div>
  );
}
