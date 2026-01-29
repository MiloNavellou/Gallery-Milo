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

const fixPath = (path) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.BASE_URL; 
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${cleanPath}`;
};

const FIXED_DATA = DATA.map(item => ({
  ...item,
  url: fixPath(item.url)
}));

const TEXTURE_URLS = FIXED_DATA.map(d => d.url);
useTexture.preload(TEXTURE_URLS);

export default function App() {
  const [isLocked, setIsLocked] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [lastCloseTime, setLastCloseTime] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMobilePermission, setHasMobilePermission] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // FONCTION POUR OUVRIR LE MENU
  const openProjectMenu = () => {
    console.log("🔵 openProjectMenu appelée");
    
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    
    document.body.style.cursor = "auto";
    setIsLocked(false);
    setIsMenuOpen(true);
    
    console.log("✅ Menu ouvert");
  };

  const closeProjectMenu = () => {
    console.log("❌ Fermeture du menu");
    setLastCloseTime(Date.now());
    setIsMenuOpen(false);
    setTimeout(() => setIsLocked(true), 100);
  };

  const handleProjectSelect = (project) => {
    if (Date.now() - lastCloseTime < 2000) return;
    document.exitPointerLock();
    setIsLocked(false);
    setSelectedProject(project);
  };

  // Fonction pour sélectionner depuis la liste
  const handleProjectSelectFromList = (project) => {
    console.log("🎨 Projet sélectionné:", project.title);
    console.log("📊 État avant:", { isMenuOpen, selectedProject: selectedProject?.title });
    
    document.exitPointerLock();
    setIsLocked(false);
    
    // D'abord fermer le menu
    setIsMenuOpen(false);
    
    // Puis ouvrir le projet avec un petit délai pour que React ait le temps de mettre à jour
    setTimeout(() => {
      console.log("🚀 Ouverture du projet:", project.title);
      setSelectedProject(project);
    }, 100);
  };

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

  useEffect(() => {
    if (selectedProject || isMenuOpen) {
      const unlock = () => {
        if (document.pointerLockElement) document.exitPointerLock();
        document.body.style.cursor = "auto";
      };
      unlock();
      const timer = setTimeout(unlock, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedProject, isMenuOpen]);

  // DEBUG : Logger les changements d'état
  useEffect(() => {
    console.log("📌 État actuel:", {
      isMenuOpen,
      selectedProject: selectedProject?.title || null,
      isLocked
    });
  }, [isMenuOpen, selectedProject, isLocked]);

  return (
    <div style={{ width: "100%", height: "100%", background: "black", position: 'relative' }}>
      
      {/* 1. Loader (Au fond) */}
      <LoaderScreen />
      
      {/* 2. ÉCRAN D'ACCUEIL */}
      <IntroOverlay
        isVisible={!isLocked && !selectedProject && !isMenuOpen && !hasMobilePermission}
        onEnter={() => setIsLocked(true)}
      />

      {/* 3. MENU LISTE DES PROJETS */}
      {isMenuOpen && (
        <ProjectListOverlay
          projects={FIXED_DATA} 
          onClose={closeProjectMenu}
          onSelect={handleProjectSelectFromList}
        />
      )}

      {/* 4. DÉTAIL PROJET */}
      {selectedProject && (
        <ProjectOverlay
          project={selectedProject}
          onClose={() => {
            console.log("🔙 Fermeture du projet");
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

      {/* 6. SCÈNE 3D */}
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
              onActivate={openProjectMenu}
            />

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

      {/* 7. INTERFACE MOBILE */}
      <MobileInterface
        hasPermission={hasMobilePermission}
        onPermissionGranted={() => {
          setHasMobilePermission(true);
          setIsLocked(true);
        }}
        onOpenMenu={openProjectMenu}
      />

    </div>
  );
}
