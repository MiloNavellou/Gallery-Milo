import { useState, useMemo, useEffect } from "react";
import { useTexture, Text } from "@react-three/drei";

export default function Tableau({ item, onSelect }) {
  const texture = useTexture(item.url);
  const [hovered, setHover] = useState(false);

  // Détection Mobile (pour adapter le clic)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Optimisation dimensions
  const { width, height } = useMemo(() => {
    const h = 4;
    const ratio = texture.image ? texture.image.width / texture.image.height : 1;
    return { width: h * ratio, height: h };
  }, [texture]);

  const cartelX = -(width / 2) - 0.7;
  const cartelY = -(height / 2) + 0.2;

  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer';
    else document.body.style.cursor = 'auto';
  }, [hovered]);

  // --- LOGIQUE DE CLIC HYBRIDE ---
  const handleInteraction = (e) => {
    e.stopPropagation();
    onSelect(item);
  };

  return (
    <group position={item.position} rotation={item.rotation}>
      {/* ZONE CLIQUABLE */}
      <mesh
        position={[0, 0, 0.1]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        
        // 1. DESKTOP : On utilise onClick (plus propre, évite les erreurs)
        onClick={(e) => {
            if (!isMobile) handleInteraction(e);
        }}

        // 2. MOBILE : On utilise onPointerUp 
        // C'est le seul moyen fiable de valider un clic quand le gyroscope fait trembler la caméra
        onPointerUp={(e) => {
            if (isMobile) handleInteraction(e);
        }}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          emissive="white"
          emissiveIntensity={hovered ? 0.3 : 0}
          toneMapped={false}
        />
      </mesh>

      {/* CADRE */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[width + 0.2, height + 0.2, 0.15]} />
        <meshStandardMaterial color="#111111" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* CARTEL */}
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
  );
}