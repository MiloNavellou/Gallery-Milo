import { useEffect, useState } from "react";

export default function IntroOverlay({ isVisible, onEnter }) {
  const [startAnim, setStartAnim] = useState(false);
  
  // États pour le survol
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isPortfolioHovered, setIsPortfolioHovered] = useState(false);
  const [isMiloHovered, setIsMiloHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnim(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const galleryText = "My Gallery".split("");
  const portfolioText = "Portfolio.".split("");
  const miloText = "Milo".split(""); 

  return (
    <>
      <style>{`
        /* --- CONSTANTES --- */
        :root {
          --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
          --ease-in-quart: cubic-bezier(0.895, 0.03, 0.685, 0.22);
          --ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
          --line-color: #E0E0E0;
        }

        /* --- LAYOUT GLOBAL --- */
        .intro-container {
          position: fixed; top: 0; left: 0;
          width: 100vw; height: 100vh; z-index: 99999;
          background: white; display: flex;
          font-family: 'Aileron', sans-serif;
          transform: translateY(0);
          transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1); 
          will-change: transform;
        }

        /* === ANIMATIONS DE SORTIE (EXIT) === */
        .intro-container.closed { 
          transform: translateY(-100%); 
          pointer-events: none;
          transition-delay: 0.6s; 
        }
        .intro-container.closed .reveal-inner {
          transform: translateY(-150%);
          transition: transform 0.5s var(--ease-in-quart);
        }
        .intro-container.closed .d-1 { transition-delay: 0s; }
        .intro-container.closed .d-2 { transition-delay: 0.05s; }
        .intro-container.closed .d-3 { transition-delay: 0.1s; }
        .intro-container.closed .border-bottom-draw { width: 0%; transition-delay: 0.1s; }
        .intro-container.closed .border-left-draw { height: 0%; transition-delay: 0.1s; }
        .intro-container.closed .cta-box { transform: scaleY(0); transition-delay: 0.2s; }
        .intro-container.closed .instructions-text,
        .intro-container.closed .portfolio-link { opacity: 0; transition-delay: 0s; }


        /* --- COLONNES --- */
        .intro-left-col { width: 35%; height: 100%; background-color: #7A2626; color: white; position: relative; overflow: hidden; }
        .intro-right-col { width: 65%; height: 100%; background: white; display: flex; flex-direction: column; position: relative; }

        /* --- MASK REVEAL --- */
        .reveal-mask { overflow: hidden; display: block; position: relative; padding-bottom: 20px; margin-bottom: -20px; }
        .reveal-inner { display: block; transform: translateY(150%); transition: transform 1.5s var(--ease-out-expo); will-change: transform; }
        .start-anim .reveal-inner { transform: translateY(0); }
        .d-1 { transition-delay: 0.1s; } .d-2 { transition-delay: 0.2s; } .d-3 { transition-delay: 0.3s; }

        /* --- LIGNES --- */
        .anim-border { position: absolute; background-color: var(--line-color); z-index: 10; }
        .border-bottom-draw { bottom: 0; left: 0; height: 2px; width: 0%; transition: width 1.2s var(--ease-out-expo); transition-delay: 0.4s; }
        .start-anim .border-bottom-draw { width: 100%; }
        .border-left-draw { top: 0; left: 0; width: 2px; height: 0%; transition: height 1.2s var(--ease-out-expo); transition-delay: 0.6s; }
        .start-anim .border-left-draw { height: 100%; }

        /* --- ELEMENTS STATIQUES --- */
        .instructions-text { 
            position: absolute; top: 60px; left: 40px; 
            font-size: 0.9rem; line-height: 1.6; max-width: 280px; 
            opacity: 0; transform: translateY(20px); 
            transition: opacity 1s ease 1s, transform 1s ease 1s; 
        }
        .start-anim .instructions-text { opacity: 0.9; transform: translateY(0); }

        /* === EFFET ROLLING SUR MILO (Blanc) === */
        .milo-wrapper-hover { display: inline-flex; overflow: hidden; cursor: pointer; line-height: 0.8; vertical-align: bottom; }
        .roll-char { display: inline-block; position: relative; transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1); color: white; }
        .roll-char::after { content: attr(data-char); position: absolute; top: 100%; left: 0; width: 100%; color: white; }
        .hover-active .roll-char { transform: translateY(-100%); }

        /* === EFFET ROLLING SUR MY GALLERY (Noir, corrigé pour jambages) === */
        .gallery-wrapper-char {
            display: inline-block;
            overflow: hidden;
            position: relative;
            vertical-align: bottom;
            line-height: 1.15em; /* Hauteur augmentée pour inclure la queue du 'y' */
            height: 1.15em;      /* Force le masque à cette hauteur */
        }
        
        .gallery-roll-char {
            display: inline-block;
            position: relative;
            transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
            color: black;
            line-height: 1.15em; 
        }

        .gallery-roll-char::after {
            content: attr(data-char);
            position: absolute;
            top: 100%; 
            left: 0;
            width: 100%;
            color: black;
            line-height: 1.15em;
        }

        .gallery-hover-active .gallery-roll-char {
            transform: translateY(-100%);
        }

        /* === AUTRES EFFETS TEXTE === */
        .word-magnify {
            display: inline-block; font-weight: 600; cursor: none;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.2s ease;
            position: relative; z-index: 10;
        }
        .word-magnify:hover { transform: scale(2); color: #fff; text-shadow: 0 5px 15px rgba(0,0,0,0.3); }

        .backwards, .forwards {
            display: inline-block; font-weight: 600; cursor: none;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.2s ease;
            position: relative; z-index: 10;
        }
        .backwards:hover { transform: translateY(50px) scale(1.5); color: #fff; text-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        .forwards:hover { transform: translateY(-50px) scale(1.5); color: #fff; text-shadow: 0 5px 15px rgba(0,0,0,0.3); }

        .name-wrapper-centered { position: absolute; top: 65%; left: 50%; transform: translate(-50%, -50%) rotate(-90deg); display: flex; flex-direction: column; align-items: flex-start; gap: 0px; width: fit-content; height: fit-content; }
        .intro-greeting-sub { font-size: 1.8rem; font-weight: 300; opacity: 0.9; margin: 0; white-space: nowrap; margin-left: 20px; }
        
        .intro-milo-huge { font-size: 14rem; font-weight: 900; line-height: 0.8; margin: 0; letter-spacing: -5px; white-space: nowrap; }

        .header-row { display: flex; height: 35%; align-items: stretch; position: relative; }
        .title-container { flex: 1; display: flex; align-items: center; padding-left: 60px; cursor: pointer; }
        .gallery-title { font-size: clamp(4rem, 10vw, 11rem); font-weight: 400; color: black; margin: 0; letter-spacing: -3px; line-height: 1; display: flex; }

        /* WAVE EFFECTS (Pour Portfolio seulement) */
        .char-portfolio { display: inline-block; transform-origin: center center; }
        .animate-wave-v { animation: wave-anim-v 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        @keyframes wave-anim-v { 0% { transform: translateX(0); } 30% { transform: translateX(-10px) rotate(2deg); } 60% { transform: translateX(3px); } 100% { transform: translateX(0); } }

        .portfolio-link-wrapper { width: 140px; display: flex; align-items: center; justify-content: center; background: white; text-decoration: none; position: relative; }
        .portfolio-link { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 1.8rem; font-weight: 600; color: black; text-decoration: none !important; letter-spacing: 1px; white-space: nowrap; border: none; display: block; opacity: 0; transition: opacity 1s ease 1s; }
        .start-anim .portfolio-link { opacity: 1; }

        .content-row { flex: 1; display: flex; align-items: flex-end; justify-content: space-between; padding-left: 60px; position: relative; }
        .description-block { max-width: 480px; padding-bottom: 60px; color: black; font-size: 1.25rem; line-height: 1.4; font-weight: 400; }

        .cta-box { width: 320px; height: 320px; background-color: #7A2626; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden; transform: scaleY(0); transform-origin: bottom; transition: transform 1s var(--ease-out-expo), background-color 0.1s; transition-delay: 0.8s; }
        .start-anim .cta-box { transform: scaleY(1); }
        .cta-box:hover { background-color: #5c1c1c; }

        .arrow-wrapper { position: relative; width: 180px; height: 180px; display: flex; align-items: center; justify-content: center; }
        .cta-arrow { width: 180px; height: 180px; fill: none; stroke: white; stroke-width: 1; stroke-linecap: square; stroke-linejoin: miter; position: absolute; top: 0; left: 0; }
        
        .arrow-main { 
            transform: translate(0, 0); 
            stroke-dasharray: 450; stroke-dashoffset: 450; 
            transition: stroke-dashoffset 1.5s var(--ease-out-expo) 1.1s, transform 0.6s var(--ease-in-out-quart) 0s; 
        }
        .start-anim .arrow-main { stroke-dashoffset: 0; }
        
        .arrow-clone { 
            transform: translate(-150%, -150%); 
            stroke-dasharray: 450; stroke-dashoffset: 0; 
            transition: transform 0.6s var(--ease-in-out-quart) 0s; 
        }
        
        .cta-box:hover .arrow-main { transform: translate(150%, 150%); }
        .cta-box:hover .arrow-clone { transform: translate(0, 0); }

        /* MOBILE */
        @media (max-width: 1024px) {
           .intro-container { flex-direction: column; overflow-y: auto; padding-bottom: 120px; }
           .intro-container.closed { transition-delay: 0s; }
           .intro-container.closed .reveal-inner { transform: translateY(-100%); }
           .intro-left-col { width: 100%; min-height: 350px; padding: 40px 20px; overflow: visible; }
           .instructions-text { display: none; }
           .name-wrapper-centered { position: relative; top: auto; left: auto; transform: none; align-items: flex-start; gap: 0; margin-top: 20px; }
           .intro-greeting-sub { font-size: 1.2rem; margin-left: 0; margin-bottom: 0; }
           .intro-milo-huge { font-size: 7rem; line-height: 0.9; }
           .intro-right-col { width: 100%; height: auto; overflow: visible; }
           .border-bottom-draw, .border-left-draw { display: none; }
           .header-row { height: auto; flex-direction: column; padding: 40px 20px; }
           .title-container { padding-left: 0; margin-bottom: 20px; }
           .gallery-title { font-size: 4.5rem; flex-wrap: wrap; }
           .portfolio-link-wrapper { width: 100%; padding: 20px 0; justify-content: flex-start; border-bottom: 1px solid #ddd; margin-bottom: 20px; display: block; }
           .portfolio-link { writing-mode: horizontal-tb; transform: none; font-size: 1.5rem; opacity: 1; transition-delay: 0s; }
           .content-row { padding-left: 0; flex-direction: column; align-items: flex-start; }
           .description-block { padding: 0 20px 20px 20px; font-size: 1rem; }
           .cta-box { position: fixed; bottom: 0; left: 0; width: 100%; height: 120px; z-index: 200; box-shadow: 0px -5px 20px rgba(0,0,0,0.1); transform: translateY(100%); transform-origin: center; }
           .start-anim .cta-box { transform: translateY(0); }
           .intro-container.closed .cta-box { transform: translateY(100%); }
           .cta-arrow { width: 60px; height: 60px; }
           .arrow-clone { display: none; }
           .cta-box:hover .arrow-main { transform: none; }
        }
      `}</style>

      <div className={`intro-container ${startAnim ? 'start-anim' : ''} ${!isVisible ? 'closed' : ''}`}>
        
        <div className="intro-left-col">
          <div className="instructions-text">
            You can <span className="word-magnify">zoom</span> in and out using the <span className="forwards">forward</span> and <span className="backwards">backward</span> arrows. 
            To select a project, <span className="word-magnify">move</span> the cursor over the <span className="word-magnify">project</span> and <span className="word-magnify">click</span> on it.
          </div>

          <div className="name-wrapper-centered">
            <div className="reveal-mask">
              <span className="intro-greeting-sub reveal-inner d-2">Hello everyone, I'm</span>
            </div>
            
            <div className="reveal-mask">
              <h1 
                className="intro-milo-huge reveal-inner d-2"
                onMouseEnter={() => setIsMiloHovered(true)}
                onMouseLeave={() => setIsMiloHovered(false)}
              >
                <span className={`milo-wrapper-hover ${isMiloHovered ? 'hover-active' : ''}`}>
                    {miloText.map((char, index) => (
                        <span 
                            key={index} 
                            className="roll-char" 
                            data-char={char}
                            style={{ transitionDelay: `${index * 0.05}s` }}
                        >
                            {char}
                        </span>
                    ))}
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="intro-right-col">
          <div className="header-row">
            <div className="anim-border border-bottom-draw"></div>
            
            <div 
              className="title-container" 
              onClick={onEnter}
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
            >
              <div className="reveal-mask">
                <h2 
                    className={`gallery-title reveal-inner d-1 ${isTitleHovered ? 'gallery-hover-active' : ''}`}
                >
                  {galleryText.map((char, index) => (
                    <span 
                      key={index} 
                      className="gallery-wrapper-char"
                    >
                        <span 
                            className="gallery-roll-char"
                            data-char={char}
                            style={{ 
                                transitionDelay: `${index * 0.03}s`,
                                minWidth: char === " " ? "0.2em" : "auto"
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    </span>
                  ))}
                </h2>
              </div>
            </div>
            
            <div className="portfolio-link-wrapper">
              <div className="anim-border border-left-draw"></div>
              <a 
                href="https://milonavellou.framer.website/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="portfolio-link"
                style={{ textDecoration: 'none', border: 'none' }}
                onMouseEnter={() => setIsPortfolioHovered(true)}
                onMouseLeave={() => setIsPortfolioHovered(false)}
                key={isPortfolioHovered ? "hover-p" : "idle-p"}
              >
                {portfolioText.map((char, index) => (
                    <span 
                      key={index} 
                      className={`char-portfolio ${isPortfolioHovered ? 'animate-wave-v' : ''}`}
                      style={{ 
                        animationDelay: `${index * 0.04}s`,
                        minHeight: char === " " ? "0.1em" : "auto"
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
              </a>
            </div>
          </div>

          <div className="content-row">
            <div className="reveal-mask">
              <div className="description-block reveal-inner d-3">
                Welcome to my immersive gallery of my favourite projects completed during my studies at the IUT in Lannion.
              </div>
            </div>

            {/* === MISE A JOUR DES SVG ICI === */}
            <div className="cta-box" onClick={onEnter}>
              <div className="arrow-wrapper">
                <svg className="cta-arrow arrow-main" viewBox="0 0 100 100">
                 
                  <path d="M 90 10 L 90 90 L 10 90 M 10 10 L 90 90" />
                </svg>
                <svg className="cta-arrow arrow-clone" viewBox="0 0 100 100">
                  {/* Nouveau tracé propre */}
                  <path d="M 90 10 L 90 90 L 10 90 M 10 10 L 90 90" />
                </svg>
              </div>
            </div>
            {/* ============================= */}
          </div>
        </div>
      </div>
    </>
  );
}