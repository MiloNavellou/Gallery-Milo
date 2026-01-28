import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { mobileInputs } from "./MobileInterface"; // Import des inputs mobiles

export default function MoveController({ isLocked, isMobile }) {
  const { camera } = useThree();
  const moveState = useRef({ forward: false, backward: false });
  
  // Limites de la zone de marche
  const LIMITS = { minX: -9, maxX: 9, minZ: -14, maxZ: 14 };

  // --- LOGIQUE CLAVIER ---
  useEffect(() => {
    if (isMobile) return;
    const onKeyDown = (e) => {
      switch(e.code) {
        case 'ArrowUp': case 'KeyW': case 'KeyZ': moveState.current.forward = true; break;
        case 'ArrowDown': case 'KeyS': moveState.current.backward = true; break;
      }
    };
    const onKeyUp = (e) => {
      switch(e.code) {
        case 'ArrowUp': case 'KeyW': case 'KeyZ': moveState.current.forward = false; break;
        case 'ArrowDown': case 'KeyS': moveState.current.backward = false; break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isMobile]);

  // --- BOUCLE D'ANIMATION ---
  useFrame((state, delta) => {
    if (!isMobile && !isLocked) return;

    // Vitesse adaptée aux FPS (delta)
    const speed = 4.5 * delta; 
    const direction = new Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const forward = moveState.current.forward || mobileInputs.forward;
    const backward = moveState.current.backward || mobileInputs.backward;

    if (forward || backward) {
      const moveVector = direction.clone().multiplyScalar(speed);
      if (backward) moveVector.negate();

      const nextX = camera.position.x + moveVector.x;
      const nextZ = camera.position.z + moveVector.z;
      
      // Collisions
      if (nextX > LIMITS.minX && nextX < LIMITS.maxX) camera.position.x = nextX;
      if (nextZ > LIMITS.minZ && nextZ < LIMITS.maxZ) camera.position.z = nextZ;
    }
  });

  return null;
}