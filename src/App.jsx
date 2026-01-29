import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, DeviceOrientationControls, useTexture } from "@react-three/drei";

// --- IMPORTS LOCAUX ---
import { DATA } from "./data";
import "./App.css";

// Composants de logique et UI
import MoveController from "./components/MoveController";
import ProjectListOverlay from "./components/ProjectListOverlay";
import ProjectOverlay from "./components/ProjectOverlay";
import IntroOverlay from "./components/IntroOverlay";
import LoaderScreen from "./components/LoaderScreen";
import MobileInterface from "./components/MobileInterface";

// Composants 3D
import Tableau from "./components/Tableau";
import { 
  Couloir, 
  MurPresentation, 
  MurPresentationGauche, 
  RegardInitial, 
  BoutonProjets 
} from "./components/Environment";

// --- CORRECTION DES CHEMINS (FIX GITHUB PAGES) ---
// Ajoute le base URL (/Gallery-Milo/) si on est en prod et que le chemin est relatif
const fixPath = (path) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  // import.meta.env.BASE_URL vaut "/Gallery-Milo/" grâce à vite.config.js
  const baseUrl = import.meta.env.BASE_URL; 
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${baseUrl}${cleanPath}`;
};

// On crée une version corrigée des données pour toute l'app
const FIXED_DATA = DATA.map(item => ({
  ...item,
  url: fixPath(item.url)
}));

// --- PRÉCHARGEMENT ---
const TEXTURE_URLS = FIXED_DATA.map(d => d.url);
useTexture.preload(TEXTURE_URLS);

export default function App() {
  // --- ÉTATS ---
  const [isLocked, setIsLocked] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [lastCloseTime, setLastCloseTime] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMobilePermission, setHasMobilePermission] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // --- HANDLERS ---
  const closeProjectMenu = () => {
    setLastCloseTime(Date.now());
    setIsMenuOpen(false);
    setTimeout(() => setIsLocked(true), 100);
  };

const handleProjectSelect = (project) => {
    // 1. Délai de sécurité (2 secondes comme demandé précédemment)
    if (Date.now() - lastCloseTime < 2000) return;
    
    // 2. ORDRE CRUCIAL :
    // A. On force le navigateur à lâcher la souris TOUT DE SUITE
    document.exitPointerLock();
    
    // B. On dit à React : "Arrête d'afficher les contrôles 3D (PointerLockControls)"
    setIsLocked(false);
    
    // C. On affiche l'overlay du projet
    setSelectedProject(project);
  };

  // --- EFFECTS (Pointer Lock) ---
  useEffect(() => {
    if (selectedProject || isMenuOpen) {
      if (document.pointerLockElement) document.exitPointerLock();
      setIsLocked(false);
    }
  }, [selectedProject, isMenuOpen]);

  useEffect(() => {
    const handleLockChange = () => {
      if (document.pointerLockElement === null && !isMobile) {
        setIsLocked(false);
      }
    };
    document.addEventListener("pointerlockchange", handleLockChange);
    return () => document.removeEventListener("pointerlockchange", handleLockChange);
  }, [isMobile]);
  // ... (vos autres useEffects)

  // GARDIEN DU CURSEUR
  // Si un projet est ouvert OU le menu est ouvert -> on force le curseur et le déverrouillage
  useEffect(() => {
    if (selectedProject || isMenuOpen) {
      const unlock = () => {
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
        document.body.style.cursor = "auto";
      };
      
      // On l'exécute immédiatement
      unlock();
      
      // ET on insiste 100ms après (pour contrer le navigateur qui serait lent)
      const timer = setTimeout(unlock, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedProject, isMenuOpen]);


  return (
    <div style={{ width: "100%", height: "100%", background: "black", position: 'relative' }}>
      
      {/* 1. INTERFACE MOBILE */}
      <LoaderScreen />
      <MobileInterface
        hasPermission={hasMobilePermission}
        onPermissionGranted={() => {
          setHasMobilePermission(true);
          setIsLocked(true);
        }}
      />

      {/* 2. ÉCRAN D'ACCUEIL */}
      <IntroOverlay
        isVisible={!isLocked && !selectedProject && !isMenuOpen && !hasMobilePermission}
        onEnter={() => setIsLocked(true)}
      />

      {/* 3. MENU LISTE DES PROJETS */}
      {isMenuOpen && (
        <ProjectListOverlay
          projects={FIXED_DATA} // Utilise les données corrigées
          onClose={closeProjectMenu}
          onSelect={(p) => {
             setIsMenuOpen(false);
             handleProjectSelect(p);
          }}
        />
      )}

      {/* 4. DÉTAIL PROJET */}
      {selectedProject && (
        <ProjectOverlay
          project={selectedProject}
          onClose={() => {
            setLastCloseTime(Date.now());
            setSelectedProject(null);
            if(!isMobile) setIsLocked(true); 
          }}
        />
      )}

      {/* 5. VISEUR CENTRAL */}
      {!isMobile && isLocked && (
        <div
          style={{
            position: "fixed", top: "50%", left: "50%",
            width: "40px", height: "40px",
            border: "1px solid rgba(255,255,255,0.8)", borderRadius: "50%",
            transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 9999,
            mixBlendMode: "difference", animation: "distordu 3s ease-in-out infinite"
          }}
        />
      )}

      {/* --- SCÈNE 3D --- */}
      {/* FIX CRITIQUE IOS : On cache le conteneur du canvas quand l'overlay est ouvert */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, width: "100%", height: "100%", zIndex: 1,
        visibility: selectedProject ? 'hidden' : 'visible' 
      }}>
        <Canvas
          shadows
          dpr={[1, 2]} 
          gl={{ powerPreference: "high-performance", antialias: false, stencil: false, depth: true }}
          camera={{ position: [0, 1.6, 4], fov: 75 }}
        >
          <RegardInitial />
          
          <fog attach="fog" args={["black", 5, 24]} />
          <ambientLight intensity={0.8} />
          <spotLight
            position={[0, 15, 0]} angle={1.2} penumbra={0.5} intensity={5000}
            castShadow shadow-bias={-0.0001} shadow-mapSize={[2048, 2048]}
          />

          <Suspense fallback={null}>
            {!isMobile && isLocked && <PointerLockControls selector="#root" />}
            {isMobile && hasMobilePermission && <DeviceOrientationControls />}
            
            <MoveController isLocked={isLocked} isMobile={isMobile} />

            <Couloir />
            <MurPresentation />
            <MurPresentationGauche />
            
            <BoutonProjets
              position={[0, 1.6, 9.9]}
              onActivate={() => {
                document.exitPointerLock();
                setIsMenuOpen(true);
                setIsLocked(false);
              }}
            />

            {/* Utilise FIXED_DATA ici aussi pour les textures */}
            {FIXED_DATA.map((item) => (
              <Tableau
                key={item.id}
                item={item}
                onSelect={handleProjectSelect}
              />
            ))}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}