import { Suspense, useState, useEffect } from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import {
  MeshReflectorMaterial,
  Text,
  PointerLockControls,
  DeviceOrientationControls,
} from "@react-three/drei";
import { TextureLoader, Vector3 } from "three";

// --- DONNÉES (Inchangées) ---
const DATA = [
  {
    id: 1,
    url: "jagu.webp",
    // Positionné vers le fond du couloir (Z = -7)
    position: [-9.9, 0, -7],
    rotation: [0, Math.PI / 2, 0],
    title: "La Roche Jagu",
    description:
      "This project, carried out in partnership with the Domaine Départemental de la Roche Jagu, aimed to completely rethink the park visitor experience...",
    tools: "Made with Illustrator, Affinity & Figma",
    credits:
      "Milo Navellou, Annaëlle Le Guénic, Nuno Enes, Karina Kervadec, Antonin Thomas",
    year: "2025",
    client: "Domaine de la Roche Jagu",
    link: "https://www.larochejagu.fr/",
  },

  {
    id: 2,
    url: "musee.webp",
    // Positionné pile au centre du mur (Z = 0)
    position: [-9.9, 0, 2],
    rotation: [0, Math.PI / 2, 0],
    title: "Musée Aman in Morocco",
    description:
      "Under the direction of Mr. El Mandour, I had the opportunity to oversee the entire creation of the website...",
    tools: "Made with Figma & Wordpress",
    credits: "Milo Navellou",
    year: "2025",
    client: "Mohammed VI Museum & Ministry of Habous and Islamic Affairs",
    landscape: true,
    link: "https://www.larochejagu.fr/",
  },
  {
    id: 3,
    url: "celtic.webp",
    // Positionné vers l'entrée du couloir (Z = 7)
    position: [-9.9, 0, 11],
    rotation: [0, Math.PI / 2, 0],
    title: "Celtic'GO",
    description:
      "The aim of this project was to address a local issue: the fragmentation of cultural offerings...",
    tools: "Made with Figma & Photoshop",
    credits: "Milo Navellou & Elijah Guillou",
    year: "2025",
    client: "IUT Lannion",
    link: "https://www.larochejagu.fr/",
  },
  {
    id: 4,
    url: "mascherata.webp",
    position: [9.9, 0, 2],
    rotation: [0, -Math.PI / 2, 0],
    title: "Mascherata",
    description:
      "Inspired by Venetian craftsmanship, the Mascherata project involves designing a complete e-commerce ecosystem for a luxury costume brand. Working with my partner, I combined high-fidelity design on Figma with the technical performance of PrestaShop, while developing a comprehensive strategy including SEO, web marketing, and high-end digital communication. To perfect this prestigious positioning, we devised campaigns featuring renowned ambassadors, combining traditional heritage with the demands of modern online commerce.",
    tools: "Made with Figma & Prestashop",
    credits: "Milo Navellou & Annaëlle Le Guénic",
    year: "2026",
    client: "Personal Project",
    landscape: true,
    link: "https://www.larochejagu.fr/",
  },
  {
    id: 5,
    url: "spider.webp",
    // Positionné vers le fond du couloir (Z = -7)
    position: [9.9, 0, -7],
    rotation: [0, -Math.PI / 2, 0],
    title: "Spider Man Calendar",
    description:
      "This project offers an ethical advent calendar (“Bright Patterns”) inspired by Spider-Man: Across the Spider-Verse and sponsored by the character Margo Kess. The interface, representing a Brooklyn building, invites users to log in daily to collect outfits and customize their avatar. Punctuated with mini-games every four days, the experience aims to reward loyalty by creating and sharing a unique Spider-Man, prioritizing the fun of the game over the constraints.",
    tools: "Made with Figma, React & Fl Studio",
    credits:
      "Milo Navellou, Nathan Perissat, Elijah Guillou, Noémie Bouvier, Diane Le Garrec, Harena Ramasindraïbe & Thibault Sardou",
    year: "2025",
    client: "Camille Boulestin & Thomas",
    link: "https://www.larochejagu.fr/",
  },
  // {
  //   id: 6,
  //   url: "celtic.webp",
  //   // Positionné vers l'entrée du couloir (Z = 7)
  //   position: [9.9, 0, 11],
  //   rotation: [0, -Math.PI / 2, 0],
  //   title: "Celtic'GO",
  //   description:
  //     "The aim of this project was to address a local issue: the fragmentation of cultural offerings...",
  //   tools: "Made with Figma & Photoshop",
  //   credits: "Milo Navellou & Elijah Guillou",
  //   year: "2025",
  //   client: "IUT Lannion",
  // },
];

function ProjectListOverlay({ projects, onClose, onSelect }) {
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
    <>
      <style>{`
        /* --- STYLES DESKTOP (PAR DÉFAUT) --- */
        .project-list-container {
          padding: 5vw;
        }
        
        .project-header h1 {
          font-size: clamp(3rem, 10vw, 8rem);
        }

        .project-row {
          display: grid;
          grid-template-columns: 100px 2.5fr 1.5fr 1fr;
          align-items: center;
          padding: 40px 0;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .col-year { font-size: 1.1rem; opacity: 0.8; }
        .col-title { font-size: 2rem; font-weight: 700; text-transform: uppercase; }
        .col-client { font-size: 1.1rem; opacity: 0.8; }
        .col-link { text-align: right; font-weight: 700; }

        .close-btn {
          position: fixed; top: 0; right: 0; width: 100px; height: 100px;
          background: black; color: white; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1rem;
          text-transform: uppercase; z-index: 10002;
        }

        .floating-preview {
          display: block; /* Visible sur desktop */
        }

        /* --- STYLES MOBILE (ÉCRANS < 768px) --- */
        @media (max-width: 768px) {
          .project-list-container {
            padding: 20px; /* Moins de padding sur les côtés */
            padding-top: 80px; /* Espace pour le bouton close */
          }

          .project-header h1 {
            font-size: 3.5rem; /* Titre plus petit */
            line-height: 1;
            margin-bottom: 20px;
          }

          .close-btn {
            width: 60px; height: 60px; font-size: 0.8rem; /* Bouton plus petit */
          }

          .project-row {
            display: flex; /* On passe de Grid à Flex */
            flex-direction: column; /* On empile les éléments */
            align-items: flex-start;
            padding: 25px 0;
            gap: 10px; /* Espace entre les éléments empilés */
          }

          .col-year { font-size: 0.9rem; color: #999; }
          
          .col-title { 
            font-size: 1.8rem; /* Titre un peu plus petit pour éviter les retours ligne trop fréquents */
            line-height: 1.1;
          }
          
          .col-client { 
            font-size: 1rem; 
            margin-bottom: 10px; /* Petit espace avant le lien */
          }

          .col-link {
            align-self: flex-start; /* Le lien s'aligne à gauche sur mobile */
            font-size: 0.9rem;
            text-decoration: underline;
            text-align: left;
          }

          /* CACHER L'IMAGE FLOTTANTE SUR MOBILE (Pas de hover sur tactile) */
          .floating-preview {
            display: none !important;
          }
        }
      `}</style>

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
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', sans-serif",
          transform: active ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
        }}
      >
        {/* BOUTON FERMER */}
        <button className="close-btn" onClick={handleClose}>
          Close
        </button>

        {/* TITRE */}
        <div
          className="project-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "60px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontWeight: "900",
              letterSpacing: "-0.04em",
              lineHeight: 0.8,
            }}
          >
            MY PROJECTS
          </h1>
        </div>

        {/* LISTE DES PROJETS */}
        <div style={{ borderTop: "2px solid black" }}>
          {projects.map((item) => (
            <div
              key={item.id}
              className="project-row"
              onMouseEnter={() => setHoveredImg(item.url)}
              onMouseLeave={() => setHoveredImg(null)}
              onClick={() => handleProjectClick(item)}
              style={{
                // La couleur dynamique reste inline car elle dépend du JS
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
              position: "fixed",
              left: mousePos.x,
              top: mousePos.y,
              width: "400px",
              height: "280px",
              pointerEvents: "none",
              transform: "translate(30px, -50%)",
              zIndex: 10001,
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={hoveredImg}
              alt="preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    </>
  );
}
// --- COMPOSANTS 3D ---

function Tableau({ item, onSelect }) {
  // On charge la texture
  const texture = useLoader(TextureLoader, item.url);
  const [hovered, setHover] = useState(false);

  // --- CALCUL DES DIMENSIONS SANS DÉFORMATION ---

  // 1. On fixe la hauteur pour TOUS les tableaux
  const height = 4;

  // 2. On récupère le ratio réel de l'image (Largeur / Hauteur en pixels)
  // texture.image est disponible car useLoader attend le chargement
  const ratio = texture.image.width / texture.image.height;

  // 3. On calcule la largeur parfaite pour respecter ce ratio
  // Exemple : Si l'image est carrée, width sera 4. Si c'est un 16:9, ce sera ~7.1
  const width = height * ratio;

  // --- POSITION DU CARTEL ---
  // Il s'adapte dynamiquement à la nouvelle largeur calculée
  const cartelX = -(width / 2) - 0.7;
  const cartelY = -(height / 2) + 0.2;

  return (
    <group>
      <group position={item.position} rotation={item.rotation}>
        {/* === L'OEUVRE === */}
        <mesh
          position={[0, 0, 0.1]}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
        >
          {/* La géométrie s'adapte maintenant parfaitement à l'image */}
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial
            map={texture}
            emissive={hovered ? "white" : "black"}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        </mesh>

        {/* === LE CADRE === */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[width + 0.2, height + 0.2, 0.15]} />
          <meshStandardMaterial
            color="#111111"
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>

        {/* === LE CARTEL === */}
        <group position={[cartelX, cartelY, 0]}>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[0.8, 0.4]} />
            <meshBasicMaterial color="#F0F0F0" />
          </mesh>

          <Text
            position={[-0.35, 0.08, 0.06]}
            fontSize={0.09}
            color="black"
            anchorX="left"
            anchorY="middle"
            maxWidth={0.7}
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            fontWeight={800}
          >
            {item.title.toUpperCase()}
          </Text>

          <Text
            position={[-0.35, -0.08, 0.06]}
            fontSize={0.07}
            color="#555"
            anchorX="left"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          >
            {item.year || "2025"}
          </Text>
        </group>
      </group>
    </group>
  );
}

function Couloir() {
  return (
    <group>
      {/* MURS (Gris foncé #202020) */}
      <mesh position={[0, 0, -10]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#202020" />
      </mesh>
      {/* MURS de deriere */}
      <mesh position={[0, 0, 15]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#732323" />
      </mesh>
      <mesh position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 16]} />
        <meshStandardMaterial color="#202020" />
      </mesh>
      <mesh position={[10, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 16]} />
        <meshStandardMaterial color="#202020" />
      </mesh>

      {/* SOL (Reflecteur Sombre) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[20, 30]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={50}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#5b5b5b"
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

function RegardInitial() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 1.6, -10);
  }, [camera]);
  return null;
}

function Loading() {
  return (
    <Text position={[0, 0, -5]} fontSize={0.5} color="white">
      CHARGEMENT...
    </Text>
  );
}

// --- CONTRÔLEUR DE DÉPLACEMENT ---
function MoveController({ isLocked }) {
  const { camera } = useThree();
  const [movement, setMovement] = useState({ forward: false, backward: false });
  const LIMITS = { minX: -9, maxX: 9, minZ: -14, maxZ: 14 };

  // --- LOGIQUE CLAVIER (DESKTOP - INCHANGÉE) ---
  useEffect(() => {
    if (isMobile) return; // On ne charge pas le clavier sur mobile
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
        case "KeyZ":
          setMovement((m) => ({ ...m, forward: true }));
          break;
        case "ArrowDown":
        case "KeyS":
          setMovement((m) => ({ ...m, backward: true }));
          break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
        case "KeyZ":
          setMovement((m) => ({ ...m, forward: false }));
          break;
        case "ArrowDown":
        case "KeyS":
          setMovement((m) => ({ ...m, backward: false }));
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // --- BOUCLE DE JEU ---
  useFrame(() => {
    // Sur mobile, on veut bouger même si "isLocked" est false (car pas de pointerLock sur mobile)
    // Sur desktop, on respecte isLocked
    if (!isMobile && !isLocked) return;

    // Si un menu est ouvert (overlay projet), on arrête de bouger
    // Tu peux passer une prop "canMove" si tu veux bloquer le mouvement quand un projet est ouvert

    const direction = new Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const speed = 0.15; // Vitesse de marche
    const moveVector = new Vector3(0, 0, 0);

    // 1. INPUT DESKTOP
    if (movement.forward) moveVector.add(direction);
    if (movement.backward) moveVector.sub(direction);

    // 2. INPUT MOBILE (Boutons tactiles)
    if (isMobile) {
      if (mobileInputs.forward) moveVector.add(direction);
      if (mobileInputs.backward) moveVector.sub(direction);
    }

    // APPLICATION DU MOUVEMENT
    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(speed);
      const nextX = camera.position.x + moveVector.x;
      const nextZ = camera.position.z + moveVector.z;

      // Collisions
      if (nextX > LIMITS.minX && nextX < LIMITS.maxX) camera.position.x = nextX;
      if (nextZ > LIMITS.minZ && nextZ < LIMITS.maxZ) camera.position.z = nextZ;
    }
  });

  return null;
}

// --- UI & OVERLAYS ---
function ProjectOverlay({ project, onClose }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setActive(true));
  }, []);

  const handleClose = () => {
    setActive(false);
    setTimeout(onClose, 600);
  };

  return (
    <>
      <style>{`
        /* --- VERSIONS DESKTOP (Inchangé) --- */
        .fullscreen-overlay { 
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
          background: white; 
          z-index: 20000; 
          display: grid; grid-template-columns: 35fr 65fr; 
          transform: translateY(100%); 
          transition: transform 0.6s cubic-bezier(0.76, 0, 0.24, 1); 
        }
        .fullscreen-overlay.active { transform: translateY(0); }
        
        .info-col { 
          display: flex; flex-direction: column; 
          border-right: 1px solid #E0E0E0; 
          height: 100vh; 
          overflow-y: auto; 
          background: white;
          color: black; 
        }
        .header-box { padding: 60px 40px; border-bottom: 1px solid #E0E0E0; }
        .project-title { 
          font-family: 'Inter', sans-serif; font-weight: 900; 
          font-size: clamp(3rem, 5vw, 6rem); line-height: 0.9; 
          letter-spacing: -2px; margin: 0; text-transform: uppercase; color: black;
        }
        .desc-box { 
          flex: 1; padding: 40px; 
          font-family: 'Inter', sans-serif; font-size: 1.1rem; 
          line-height: 1.6; color: #333; 
          display: flex; align-items: center; 
        }
        .meta-grid { 
          display: grid; grid-template-columns: 1fr 1fr; 
          border-top: 1px solid #E0E0E0; 
        }
        .meta-item { 
          padding: 20px; 
          border-right: 1px solid #E0E0E0; 
          border-bottom: 1px solid #E0E0E0; 
        }
        .meta-item:nth-child(2n) { border-right: none; }
        .meta-label { 
          display: block; font-family: 'Inter', sans-serif; 
          font-size: 0.75rem; font-weight: 700; 
          text-transform: uppercase; color: #999; margin-bottom: 5px; 
        }
        .meta-value { 
          font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 600; color: black;
        }
        .action-box { padding: 0; border-bottom: 1px solid #E0E0E0; }
        .figma-btn {
          display: flex; justify-content: space-between; align-items: center;
          width: 100%; padding: 30px 40px;
          background: white; color: black;
          border: none; cursor: pointer; text-decoration: none;
          font-family: 'Inter', sans-serif; font-weight: 900;
          font-size: 1.5rem; text-transform: uppercase; letter-spacing: -1px;
          transition: background 0.3s, color 0.3s;
        }
        .figma-btn:hover { background: #111; color: white; }
        .arrow-icon { font-size: 1.5rem; transform: rotate(-45deg); transition: transform 0.3s; }
        .figma-btn:hover .arrow-icon { transform: rotate(0deg); }
        .image-col { 
          position: relative; height: 100vh; background: #F0F0F0; overflow-y: auto; 
        }
        .project-image { 
          width: 100%; height: auto; min-height: 100%; object-fit: cover; display: block; 
        }
        .close-btn { 
          position: fixed; top: 0; right: 0; width: 100px; height: 100px; 
          background: black; color: white; border: none; cursor: pointer; 
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1rem; 
          text-transform: uppercase; z-index: 20002; transition: background 0.3s; 
        }
        .close-btn:hover { background: #333; }

        /* --- CORRECTION MOBILE RADICALE --- */
        @media (max-width: 768px) {
          .fullscreen-overlay { 
            /* On casse le Grid et on passe en bloc simple avec scroll global */
            display: block !important; 
            overflow-y: scroll !important; /* Le scroll se fait sur le parent */
            -webkit-overflow-scrolling: touch; /* Fluidité iOS */
          }
          
          .info-col { 
            display: block !important;
            height: auto !important; 
            width: 100% !important;
            overflow: visible !important; 
            border-right: none !important;
          }

          .image-col { 
            display: block !important;
            height: auto !important; 
            width: 100% !important;
            position: relative !important;
            overflow: visible !important;
          }
          
          .project-image {
             height: auto !important;
             max-height: 80vh; /* Limite la hauteur de l'image sur mobile */
          }

          /* Ajustements espacements mobile */
          .header-box { padding: 80px 20px 30px 20px !important; }
          .project-title { font-size: 3rem !important; word-break: break-word; }
          .desc-box { padding: 30px 20px !important; display: block !important; }
          .close-btn { width: 60px; height: 60px; font-size: 0.8rem; background: black !important; color: white !important; }
        }
      `}</style>

      <div className={`fullscreen-overlay ${active ? "active" : ""}`}>
        <button className="close-btn" onClick={handleClose}>
          Close
        </button>

        {/* Note : L'ordre HTML est important pour le mobile (Texte puis Image) */}
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

        <div className="image-col">
          <img
            src={project.url}
            alt={project.title}
            className="project-image"
          />
        </div>
      </div>
    </>
  );
}

function Typewriter({ text, delay = 0, speed = 50, style }) {
  const [displayText, setDisplayText] = useState("");
  const [startTyping, setStartTyping] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setStartTyping(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  useEffect(() => {
    if (!startTyping) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, startTyping]);
  return <div style={style}>{displayText}</div>;
}

function IntroOverlay({ isVisible, onEnter }) {
  return (
    <>
      <style>{`
@keyframes distordu {
0%, 100% { height: 15px; width: 10px; transform: translate(-50%, -50%) scale(1); }
50% { height: 10px; width: 15px; transform: translate(-50%, -50%) scale(1.1); }
}
@keyframes slideInLeft { 0% { transform: translateX(-50px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
@keyframes levitation { 0% { transform: translateY(-10px); } 50% { transform: translateY(10px); } 100% { transform: translateY(-10px); } }
@keyframes scaleIn { 0% { transform: translateY(100px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
@keyframes fadeInUp { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }

.intro-container { display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(3, 1fr); background-image: linear-gradient(to right, #E0E0E0 1px, transparent 1px), linear-gradient(to bottom, #E0E0E0 1px, transparent 1px); background-size: 20vw 33.33vh; }
/* HELLO */
.intro-hello-wrapper { grid-column: 1 / 4; grid-row: 1 / 2; display: flex; align-items: center; padding-left: 0px; line-height: 0.8; overflow: hidden; }
.intro-hello { font-size: 21vw; letter-spacing: -1vw; font-weight: 900; margin-left: -0.5vw; opacity: 0; animation: slideInLeft 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.2s; }
/* PORTFOLIO (Haut Droite) */
.intro-portfolio { grid-column: 5 / 6; grid-row: 1 / 2; background: black; color: white; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 1.2rem; letter-spacing: 1px; text-decoration: none; cursor: pointer; transition: background 0.3s; opacity: 0; animation: fadeInUp 0.8s ease forwards; animation-delay: 2.5s; }
.intro-portfolio:hover { background: #333; }

/* CONTACT ME (Bas Gauche) */
.intro-contact {
grid-column: 1 / 2;
grid-row: 3 / 4;
background: black;
color: white;
display: flex;
justify-content: center;
align-items: center;
font-weight: 700;
font-size: 1.2rem;
letter-spacing: 1px;
text-decoration: none;
cursor: pointer;
transition: background 0.3s;
opacity: 0;
animation: fadeInUp 0.8s ease forwards;
animation-delay: 2.8s;
}
.intro-contact:hover { background: #333; }

.intro-text-wrapper { grid-column: 2 / 5; grid-row: 2 / 3; }
.intro-text { font-size: 3rem; color : #862222; }
.intro-btn-wrapper { grid-column: 2 / 5; grid-row: 3 / 4; }
.btn-wrapper { display: inline-block; opacity: 0; animation: scaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 1s; }
.btn-brutal { background-color: #ffffff00; color: #000000; height: 75px; padding: 0 30px; margin-top: 20px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 10rem; line-height: 0.8; white-space: nowrap; border: none; cursor: pointer; overflow: visible; clip-path: inset(0 0 0 0); animation: levitation 4s ease-in-out infinite; will-change: transform, clip-path; transition: clip-path 1s ease-in-out, transform 0.1s; }
.btn-brutal:hover { clip-path: inset(-100px 0 -100px 0); }

.intro-keys-wrapper { grid-column: 5 / 6; grid-row: 3 / 4; display: flex; flex-direction: column; justify-content: center; align-items: center; opacity: 0; animation: fadeInUp 0.8s ease forwards; animation-delay: 3.2s; }
.keys-container { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 12px; }
.key-box { width: 50px; height: 50px; border: 3px solid #333; border-radius: 10px; display: flex; justify-content: center; align-items: center; background: white; font-size: 1.8rem; font-weight: 900; line-height: 1; color: #333; box-shadow: 3px 3px 0px #333; }
.keys-text { font-family: 'Inter', sans-serif; font-weight: 200; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1px; color: #333; text-align: center; }

@media (max-width: 768px) {
.intro-container { display: flex !important; flex-direction: column; background-size: 100vw 25vh !important; }
.intro-hello-wrapper { padding-left: 20px !important; height: 30vh; align-items: flex-end !important; }
.intro-hello { font-size: 25vw; margin-left: 0; letter-spacing: -5px; }
.btn-brutal { font-size: 50px; height: 40px; padding: 0 20px; }
.intro-text { font-size: 1.8rem; padding: 0 20px; margin-top: 40px; }
.intro-portfolio, .intro-contact { width: 100%; height: 60px; justify-content: flex-start !important; padding-left: 20px; background: transparent !important; color: black !important; }
.intro-text-wrapper { flex: 1; justify-content: center; }
.intro-btn-wrapper { height: 25vh; align-items: center; }
.intro-keys-wrapper { display: none !important; }
}
`}</style>
      <div
        className="intro-container"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 20,
          backgroundColor: "white",
          color: "black",
          fontFamily: "'Inter', sans-serif",
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          pointerEvents: isVisible ? "all" : "none",
          transition: "transform 1s cubic-bezier(0.76, 0, 0.24, 1)",
        }}
      >
        <a
          href="https://milonavellou.framer.website/"
          target="_blank"
          rel="noopener noreferrer"
          className="intro-portfolio"
        >
          PORTFOLIO
        </a>

        <div className="intro-hello-wrapper">
          <div className="intro-hello">HELLO</div>
        </div>

        <div
          className="intro-text-wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="intro-text">
            <Typewriter
              text="I'm Milo,"
              delay={800}
              speed={50}
              style={{ fontWeight: "700" }}
            />
            <Typewriter
              text="Welcome to my gallery"
              delay={1500}
              speed={40}
              style={{ fontWeight: "400" }}
            />
          </div>
        </div>

        <div
          className="intro-btn-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="btn-wrapper">
            <button className="btn-brutal" onClick={onEnter}>
              Discover
            </button>
          </div>
        </div>

        {/* LIEN CONTACT ME (Bas Gauche) */}
        <a href="mailto:milo.navellou@gmail.com" className="intro-contact">
          CONTACT ME
        </a>

        <div className="intro-keys-wrapper">
          <div className="keys-container">
            <div className="key-box">↑</div>
            <div className="key-box">↓</div>
          </div>
          <div className="keys-text">
            Press these keys on your <br /> keyboard to zoom around
          </div>
        </div>
      </div>
    </>
  );
}

function MurPresentation() {
  const fontUrl =
    "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";

  return (
    <group position={[0, 2, -9.8]} rotation={[0, 0, 0]}>
      <Text
        position={[-3.3, 1.5, 0]}
        fontSize={1.3}
        color="#FFFFFF"
        // Utilise ce lien pour la version Bold (700) de Inter
        font={fontUrl}
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.05}
      >
        Welcome everyone
      </Text>

      <Text
        position={[-6, -0.2, 0]}
        fontSize={0.28}
        color="#ffffff"
        font={fontUrl}
        anchorX="center"
        anchorY="top"
        maxWidth={5}
        lineHeight={1.6}
        textAlign="left"
      >
        Hello everyone, my name is Milo Navellou, I am 20 years old and I am a
        third-year student studying for a Bachelor's degree in Multimedia and
        Internet Professions, specializing in communication strategy and UX/UI
        design in Lannion.
      </Text>
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.28}
        color="#ffffff"
        font={fontUrl}
        anchorX="center"
        anchorY="top"
        maxWidth={5}
        lineHeight={1.6}
        textAlign="left"
      >
        Passionate about programming, design, and digital communication, I
        combine aesthetics and functionality to create web solutions. My goal is
        to work in a field that combines technology, multimedia, and creativity.
      </Text>
      <Text
        position={[6, -0.2, 0]}
        fontSize={0.28}
        color="#ffffff"
        font={fontUrl}
        anchorX="center"
        anchorY="top"
        maxWidth={5}
        lineHeight={1.6}
        textAlign="left"
      >
        Welcome to my virtual project gallery, where you will find some of my
        favorite projects, completed individually or in groups as part of my
        university studies and personal development.
      </Text>
      <Text
        position={[3.5, -4, 0]}
        fontSize={0.6}
        color="#ffffff"
        font={fontUrl}
        anchorX="left"
        anchorY="top"
        textAlign="left"
        letterSpacing={-0.02}
      >
        Enjoy your visit.
      </Text>
    </group>
  );
}

function MurPresentationGauche() {
  const fontUrl =
    "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";

  return (
    <group position={[-9.8, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
      <Text
        position={[-7.5, 1.5, 0]}
        fontSize={1.3}
        color="#FFFFFF"
        // Utilise ce lien pour la version Bold (700) de Inter
        font={fontUrl}
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.05}
      >
        My favourite projects
      </Text>
    </group>
  );
}

function BoutonProjets({ position, onActivate }) {
  const [hovered, setHover] = useState(false);

  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* ZONE D'INTERACTION (Invisible mais large pour faciliter le clic) */}
      <mesh
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
      >
        <planeGeometry args={[5, 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* TITRE PRINCIPAL : On joue sur l'épaisseur et l'espacement */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="white"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        letterSpacing={0.2}
        fontWeight={900}
      >
        MES PROJETS
      </Text>

      {/* LIGNE DE SOULIGNEMENT ANIMÉE (Scale X au hover) */}
      <mesh position={[0, -0.4, 0.01]} scale={[hovered ? 1 : 0.2, 1, 1]}>
        <planeGeometry args={[3, 0.02]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={hovered ? 1 : 0.5}
        />
      </mesh>

      {/* PETIT TEXTE D'INDICATION (Apparaît au hover) */}
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.15}
        color="white"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fillOpacity={hovered ? 1 : 0}
        letterSpacing={0.1}
      >
        CLIQUEZ POUR EXPLORER ↗
      </Text>

      {/* HALO LUMINEUX TRÈS SUBTIL DERRIÈRE LE TEXTE */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[6, 3]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={hovered ? 0.05 : 0}
        />
      </mesh>
    </group>
  );
}

// --- LOGIQUE MOBILE ---
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// État global pour le mouvement mobile (évite les re-renders intempestifs)
const mobileInputs = {
  forward: false,
  backward: false,
};

function MobileInterface({ onPermissionGranted, hasPermission }) {
  if (!isMobile) return null;

  // 1. ÉCRAN DE PERMISSION (Si on n'a pas encore l'accès)
  if (!hasPermission) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "black",
          color: "white",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Inter', sans-serif",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h2 style={{ textTransform: "uppercase", marginBottom: "20px" }}>
          Expérience Immersive
        </h2>
        <p style={{ marginBottom: "40px", maxWidth: "300px", opacity: 0.7 }}>
          Cette expérience utilise les capteurs de votre téléphone. Tournez
          votre appareil pour regarder autour de vous.
        </p>
        <button
          onClick={async () => {
            // Demande la permission pour iOS 13+
            if (
              typeof DeviceOrientationEvent !== "undefined" &&
              typeof DeviceOrientationEvent.requestPermission === "function"
            ) {
              try {
                const response =
                  await DeviceOrientationEvent.requestPermission();
                if (response === "granted") onPermissionGranted();
                else
                  alert(
                    "Permission refusée. L'expérience nécessite l'accès à l'orientation.",
                  );
              } catch (e) {
                console.error(e);
              }
            } else {
              // Android ou vieux iOS (pas besoin de permission explicite)
              onPermissionGranted();
            }
          }}
          style={{
            background: "white",
            color: "black",
            border: "none",
            padding: "15px 30px",
            fontSize: "1rem",
            fontWeight: "900",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          COMMENCER L'EXPÉRIENCE
        </button>
      </div>
    );
  }

  // 2. BOUTONS DE NAVIGATION (Une fois la permission accordée)
  // Deux gros boutons invisibles ou stylisés en bas de l'écran
  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        zIndex: 9000,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Bouton RECULER */}
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          mobileInputs.backward = true;
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          mobileInputs.backward = false;
        }}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid white",
          color: "white",
          fontSize: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        ↓
      </button>

      {/* Bouton AVANCER */}
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          mobileInputs.forward = true;
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          mobileInputs.forward = false;
        }}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid white",
          color: "white",
          fontSize: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        ↑
      </button>
    </div>
  );
}
// --- APP PRINCIPAL ---
export default function App() {
  const [isLocked, setIsLocked] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [lastCloseTime, setLastCloseTime] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMobilePermission, setHasMobilePermission] = useState(false);

  const closeProjectMenu = () => {
    setLastCloseTime(Date.now());
    setIsMenuOpen(false);
    setTimeout(() => {
      setIsLocked(true);
    }, 100);
  };

  useEffect(() => {
    if (selectedProject) {
      document.exitPointerLock();
      setIsLocked(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    const handleLockChange = () => {
      if (document.pointerLockElement === null) {
        setIsLocked(false);
      }
    };
    document.addEventListener("pointerlockchange", handleLockChange);
    return () =>
      document.removeEventListener("pointerlockchange", handleLockChange);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "black",
      }}
    >
      <MobileInterface
        hasPermission={hasMobilePermission}
        onPermissionGranted={() => {
          setHasMobilePermission(true);
          setIsLocked(true);
        }}
      />

      <IntroOverlay
        isVisible={!isLocked && !selectedProject && !isMenuOpen}
        onEnter={() => setIsLocked(true)}
      />

      {/* OVERLAY LISTE PROJETS */}
      {isMenuOpen && (
        <ProjectListOverlay
          projects={DATA}
          onClose={closeProjectMenu}
          onSelect={(project) => {
            setIsMenuOpen(false);
            setSelectedProject(project);
            document.exitPointerLock();
            setIsLocked(false);
          }}
        />
      )}

      {/* OVERLAY DÉTAIL PROJET (Déplacé ICI, en dehors de la div absolute du canvas) */}
      {selectedProject && (
        <ProjectOverlay
          project={selectedProject}
          onClose={() => {
            setLastCloseTime(Date.now());
            setSelectedProject(null);
            setIsLocked(true);
          }}
        />
      )}

      {/* CONTENEUR 3D */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        {!isMobile && isLocked && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              width: "40px",
              height: "40px",
              backgroundColor: "transparent",
              border: "1px solid white",
              borderRadius: "50%",
              mixBlendMode: "difference",
              pointerEvents: "none",
              zIndex: 9999,
              transform: "translate(-50%, -50%)",
              transition: "transform 0.15s ease-out, width 0.3s, height 0.3s",
              animation: "distordu 2s infinite",
            }}
          />
        )}

        <Canvas shadows camera={{ position: [0, 1.6, 4], fov: 75 }}>
          <RegardInitial />
          <fog attach="fog" args={["black", 5, 24]} />
          <ambientLight intensity={0.8} />
          <spotLight
            position={[0, 15, 0]}
            angle={1.2}
            penumbra={0.5}
            intensity={5000}
            castShadow
            shadow-bias={-0.0001}
          />
          <Suspense fallback={<Loading />}>
            {!isMobile && isLocked && <PointerLockControls />}
            {isMobile && hasMobilePermission && <DeviceOrientationControls />}
            <MoveController
              isLocked={isLocked}
              hasMobilePermission={hasMobilePermission}
            />
            <BoutonProjets
              position={[0, 1.6, 9.9]}
              onActivate={() => {
                const now = Date.now();
                if (now - lastCloseTime < 2000) return;
                document.exitPointerLock();
                setIsMenuOpen(true);
                setIsLocked(false);
              }}
            />

            <Couloir />
            <MurPresentation />
            <MurPresentationGauche />

            {DATA.map((item) => (
              <Tableau
                key={item.id}
                item={item}
                onSelect={(item) => {
                  if (Date.now() - lastCloseTime < 2000) return;
                  setSelectedProject(item);
                  setIsLocked(false);
                }}
              />
            ))}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
