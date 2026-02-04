import { useState, useEffect } from "react";

// --- SOUS-COMPOSANT : WaveText (Gardé pour la liste des projets) ---
const WaveText = ({ text, isHovered, className, style }) => {
  const chars = text.split("");
  return (
    <span className={className} style={style} key={isHovered ? "hover" : "idle"}>
      {chars.map((char, index) => (
        <span
          key={index}
          className={`wave-char-list ${isHovered ? "animate-wave-list" : ""}`}
          style={{
            animationDelay: `${index * 0.03}s`,
            minWidth: char === " " ? "0.3em" : "auto",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default function ProjectListOverlay({ projects, onClose, onSelect }) {
  const [hoveredImg, setHoveredImg] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  
  // État pour le survol du TITRE PRINCIPAL
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleCloseButton = () => {
    setActive(false);
    setTimeout(onClose, 600);
  };

  const handleProjectClick = (item) => {
    setActive(false);
    setTimeout(() => {
      onSelect(item);
    }, 300);
  };

  // --- CONFIGURATION ---
  const HEADER_HEIGHT = "220px"; 
  const titleText = "My Projects".split(""); 

  return (
    <>
      <style>{`
        /* --- ANIMATION WAVE (POUR LA LISTE) --- */
        @keyframes wave-anim-list {
          0% { transform: translateY(0); }
          30% { transform: translateY(-10px) rotate(2deg); }
          60% { transform: translateY(3px); }
          100% { transform: translateY(0); }
        }
        .wave-char-list {
          display: inline-block;
          transform-origin: bottom center;
          font-weight: inherit;
        }
        .animate-wave-list {
          animation: wave-anim-list 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        /* --- ANIMATION ROLLING (POUR LE TITRE "MY PROJECTS") --- */
        .project-title-wrapper {
            display: inline-block;
            overflow: hidden;
            position: relative;
            vertical-align: bottom;
            line-height: 1.2em; 
            height: 1.2em;
        }
        
        .project-roll-char {
            display: inline-block;
            position: relative;
            transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
            color: white;
            line-height: 1.2em;
        }

        .project-roll-char::after {
            content: attr(data-char);
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            color: white;
            line-height: 1.2em;
        }

        .title-hover-active .project-roll-char {
            transform: translateY(-100%);
        }

        /* --- STYLE DE LA FLECHE SVG (MODIFIÉ) --- */
        .arrow-icon {
            width: 0.7em; /* Plus petit (était 0.9em) */
            height: 0.7em; /* Plus petit (était 0.9em) */
            margin-left: 12px;
            fill: none;
            stroke: currentColor;
            stroke-width: 8;
            stroke-linecap: square;
            stroke-linejoin: miter;
            display: block;
            transform: rotate(0deg); /* Tourné de 45 degrés */
        }

        /* SCROLLBAR PERSONALISÉE */
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); border-radius: 3px; }

        /* BOUTON INDÉPENDANT */
        .custom-close-btn {
            position: absolute; top: 0; right: 0; z-index: 2000010;
            background: black; color: white; border: none;
            width: 100px; height: 100px; cursor: pointer;
            font-weight: bold; display: flex; align-items: center; justify-content: center;
            transition: background 0.3s; font-size: 16px; text-transform: uppercase;
        }
        .custom-close-btn:hover { background: #333; }

        body { margin: 0; padding: 0; }
      `}</style>

      {/* 1. CONTENEUR PRINCIPAL */}
      <div
        onMouseMove={handleMouseMove}
        className="project-list-container"
        style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "white", color: "black", zIndex: 2000000, cursor: "default",
          overflow: "hidden", 
          transform: active ? "translate3d(0, 0, 0)" : "translate3d(0, 100%, 0)",
          transition: "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
          margin: 0, padding: 0, boxSizing: "border-box"
        }}
      >
        {/* 2. LE BOUTON */}
        <button className="custom-close-btn" onClick={handleCloseButton}>
            Close
        </button>

        {/* 3. ZONE DE DÉFILEMENT */}
        <div 
            className="custom-scroll"
            style={{
                width: "100%", height: "100%", overflowY: "auto",
                WebkitOverflowScrolling: "touch", position: "relative"
            }}
        >
            {/* HEADER ROUGE */}
            <header
              style={{
                width: "100%", height: HEADER_HEIGHT, backgroundColor: "#7A2626",
                display: "flex", alignItems: "center", padding: 0, margin: 0,
                boxSizing: "border-box", position: "relative"
              }}
            >
              <h1
                className={isTitleHovered ? "title-hover-active" : ""}
                style={{ 
                  fontFamily: "'Aileron', sans-serif", fontWeight: 900,
                  fontSize: "clamp(3rem, 5vw, 6rem)", lineHeight: 0.9, letterSpacing: "-2px",
                  margin: 0, color: "white", paddingLeft: "40px", cursor: "default", width: "100%" 
                }}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
              >
                 {/* === EFFET ROLLING SUR MY PROJECTS === */}
                 {titleText.map((char, index) => (
                    <span 
                        key={index} 
                        className="project-title-wrapper"
                    >
                        <span 
                            className="project-roll-char"
                            data-char={char}
                            style={{ 
                                transitionDelay: `${index * 0.04}s`,
                                minWidth: char === " " ? "0.3em" : "auto"
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    </span>
                 ))}
              </h1>
            </header>

            {/* LISTE DES PROJETS */}
            <div style={{ padding: "40px", width: "100%", boxSizing: "border-box" }}>
              <div className="project-list-wrapper">
                {projects.map((item) => (
                  <div
                    key={item.id}
                    className="project-row"
                    onMouseEnter={() => setHoveredImg(item.url)}
                    onMouseLeave={() => setHoveredImg(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectClick(item);
                    }}
                    style={{
                      color: hoveredImg === item.url ? "#862222" : "black",
                    }}
                  >
                    <span className="col-year">{item.year || "2025"}</span>
                    <span className="col-title">
                      <WaveText 
                        text={item.title} 
                        isHovered={hoveredImg === item.url} 
                      />
                    </span>
                    <span className="col-client">{item.client || "IUT Lannion"}</span>
                    
                    <span className="col-link" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        Discover project
                        <svg className="arrow-icon" viewBox="0 0 100 100">
                             <path d="M 90 10 L 90 90 L 10 90 M 10 10 L 90 90" />
                        </svg>
                    </span>
                    
                  </div>
                ))}
              </div>
            </div>
        </div>

        {hoveredImg && (
          <div
            className="floating-preview"
            style={{
              left: mousePos.x, top: mousePos.y,
            }}
          >
            <img src={hoveredImg} alt="preview" className="floating-img" />
          </div>
        )}
      </div>
    </>
  );
}