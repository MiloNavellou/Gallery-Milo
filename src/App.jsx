import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, DeviceOrientationControls, useTexture } from "@react-three/drei";

// --- IMPORTS LOCAUX ---
import { DATA } from "./data";
import "./App.css"; // Contient tous les styles des overlays

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

// --- PRÉCHARGEMENT ---
// Lance le chargement des images dès le début pour éviter le pop-in
const TEXTURE_URLS = DATA.map(d => d.url);
useTexture.preload(TEXTURE_URLS);

export default function App() {
  // --- ÉTATS ---
  const [isLocked, setIsLocked] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [lastCloseTime, setLastCloseTime] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMobilePermission, setHasMobilePermission] = useState(false);

  // Détection basique pour savoir si on est sur mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // --- HANDLERS ---
  const closeProjectMenu = () => {
    setLastCloseTime(Date.now());
    setIsMenuOpen(false);
    // Petit délai pour éviter que le clic ne soit interprété comme un tir/clic dans le canvas
    setTimeout(() => setIsLocked(true), 100);
  };

  const handleProjectSelect = (project) => {
    // Anti-rebond : empêche de rouvrir un projet immédiatement après fermeture
    if (Date.now() - lastCloseTime < 500) return;
    
    setSelectedProject(project);
    document.exitPointerLock();
    setIsLocked(false);
  };

  // --- EFFECTS (Pointer Lock) ---
  
  // Déverrouille si un menu s'ouvre
  useEffect(() => {
    if (selectedProject || isMenuOpen) {
      if (document.pointerLockElement) document.exitPointerLock();
      setIsLocked(false);
    }
  }, [selectedProject, isMenuOpen]);

  // Écoute les changements natifs du navigateur (touche Echap)
  useEffect(() => {
    const handleLockChange = () => {
      // Si on perd le lock et qu'on n'est pas sur mobile, on met à jour l'état
      if (document.pointerLockElement === null && !isMobile) {
        setIsLocked(false);
      }
    };
    document.addEventListener("pointerlockchange", handleLockChange);
    return () => document.removeEventListener("pointerlockchange", handleLockChange);
  }, [isMobile]);

  return (
    <div style={{ width: "100%", height: "100%", background: "black", position: 'relative' }}>
      
      {/* 1. INTERFACE MOBILE (Permissions & Contrôles Tactiles) */}
      <MobileInterface
        hasPermission={hasMobilePermission}
        onPermissionGranted={() => {
          setHasMobilePermission(true);
          setIsLocked(true);
        }}
      />

      {/* 2. ÉCRAN D'ACCUEIL (Intro Typewriter) */}
      <IntroOverlay
        isVisible={!isLocked && !selectedProject && !isMenuOpen && !hasMobilePermission}
        onEnter={() => setIsLocked(true)}
      />

      {/* 3. MENU LISTE DES PROJETS (Overlay) */}
      {isMenuOpen && (
        <ProjectListOverlay
          projects={DATA}
          onClose={closeProjectMenu}
          onSelect={(p) => {
             setIsMenuOpen(false);
             handleProjectSelect(p);
          }}
        />
      )}

      {/* 4. DÉTAIL PROJET (Overlay complet) */}
      {selectedProject && (
        <ProjectOverlay
          project={selectedProject}
          onClose={() => {
            setLastCloseTime(Date.now());
            setSelectedProject(null);
            // Sur Desktop, on relance l'immersion après fermeture
            if(!isMobile) setIsLocked(true); 
          }}
        />
      )}

      {/* 5. VISEUR CENTRAL (Crosshair) - Uniquement Desktop verrouillé */}
      {!isMobile && isLocked && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "40px",
            height: "40px",
            border: "1px solid rgba(255,255,255,0.8)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
            mixBlendMode: "difference",
            animation: "distordu 3s ease-in-out infinite"
          }}
        />
      )}

      {/* --- SCÈNE 3D --- */}
      <Canvas
        shadows
        // Optimisation : Limite le rendu à x2 max pour les écrans Retina (évite la surchauffe)
        dpr={[1, 2]} 
        // Configuration haute performance
        gl={{ powerPreference: "high-performance", antialias: false, stencil: false, depth: true }}
        camera={{ position: [0, 1.6, 4], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <RegardInitial />
        
        {/* === LUMIÈRES (Configuration Originale Restaurée) === */}
        <fog attach="fog" args={["black", 5, 24]} />
        
        <ambientLight intensity={0.8} />
        
        <spotLight
          position={[0, 15, 0]}
          angle={1.2}
          penumbra={0.5}
          intensity={5000}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize={[2048, 2048]} // Ombre plus nette
        />

        <Suspense fallback={<LoaderScreen />}>
          {/* CONTRÔLES */}
          {!isMobile && isLocked && <PointerLockControls selector="#root" />}
          {isMobile && hasMobilePermission && <DeviceOrientationControls />}
          
          <MoveController
            isLocked={isLocked}
            isMobile={isMobile}
          />

          {/* DÉCOR */}
          <Couloir />
          <MurPresentation />
          <MurPresentationGauche />
          
          {/* BOUTON D'ACCÈS AU MENU */}
          <BoutonProjets
            position={[0, 1.6, 9.9]}
            onActivate={() => {
              document.exitPointerLock();
              setIsMenuOpen(true);
              setIsLocked(false);
            }}
          />

          {/* TABLEAUX (Génération dynamique) */}
          {DATA.map((item) => (
            <Tableau
              key={item.id}
              item={item}
              onSelect={handleProjectSelect}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}