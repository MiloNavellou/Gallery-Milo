import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, Text } from "@react-three/drei";

// URL de la police Inter (version normale)
// Note: Le fontWeight dans Text gère le gras si la police le supporte, 
// sinon on pointe vers une URL spécifique. Ici le lien gère plusieurs graisses.
const FONT_URL = "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";

export function Couloir() {
  return (
    <group>
      {/* MURS (Gris foncé #202020) */}
      <mesh position={[0, 0, -10]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#202020" />
      </mesh>
      {/* MUR du fond (derrière) */}
      <mesh position={[0, 0, 15]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#732323" />
      </mesh>
      {/* MURS Latéraux */}
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
          resolution={1024} // Optimisé pour la perf (vs 2048)
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

export function RegardInitial() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 1.6, -10);
  }, [camera]);
  return null;
}

export function MurPresentation() {
  return (
    <group position={[0, 2, -9.8]} rotation={[0, 0, 0]}>
      {/* TITRE PRINCIPAL */}
      <Text
        position={[-3.3, 1.5, 0]}
        fontSize={1.3}
        color="#FFFFFF"
        font={FONT_URL}
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.05}
        fontWeight={700} // Force le gras
      >
        Welcome everyone
      </Text>

      {/* COLONNE 1 */}
      <Text
        position={[-6, -0.2, 0]}
        fontSize={0.28}
        color="#ffffff"
        font={FONT_URL}
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

      {/* COLONNE 2 */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.28}
        color="#ffffff"
        font={FONT_URL}
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

      {/* COLONNE 3 */}
      <Text
        position={[6, -0.2, 0]}
        fontSize={0.28}
        color="#ffffff"
        font={FONT_URL}
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

      {/* MESSAGE DE FIN */}
      <Text
        position={[3.5, -4, 0]}
        fontSize={0.6}
        color="#ffffff"
        font={FONT_URL}
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

export function MurPresentationGauche() {
  return (
    <group position={[-9.8, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
      <Text
        position={[-7.5, 1.5, 0]}
        fontSize={1.3}
        color="#FFFFFF"
        font={FONT_URL}
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.05}
        fontWeight={700}
      >
        My favourite projects
      </Text>
    </group>
  );
}

export function BoutonProjets({ position, onActivate }) {
  const [hovered, setHover] = useState(false);

  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* ZONE D'INTERACTION INVISIBLE */}
      <mesh
        onPointerOver={() => { 
          setHover(true); 
          document.body.style.cursor = 'pointer'; 
        }}
        onPointerOut={() => { 
          setHover(false); 
          document.body.style.cursor = 'auto'; 
        }}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
      >
        <planeGeometry args={[5, 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* TITRE PRINCIPAL */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="white"
        font={FONT_URL}
        letterSpacing={0.2}
        fontWeight={900}
      >
        MES PROJETS
      </Text>

      {/* LIGNE DE SOULIGNEMENT ANIMÉE */}
      <mesh position={[0, -0.4, 0.01]} scale={[hovered ? 1 : 0.2, 1, 1]}>
        <planeGeometry args={[3, 0.02]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={hovered ? 1 : 0.5}
        />
      </mesh>

      {/* TEXTE D'INDICATION */}
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.15}
        color="white"
        font={FONT_URL}
        fillOpacity={hovered ? 1 : 0}
        letterSpacing={0.1}
      >
        CLIQUEZ POUR EXPLORER ↗
      </Text>

      {/* HALO LUMINEUX */}
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