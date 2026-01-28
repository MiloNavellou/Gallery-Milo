import { useProgress, Html } from "@react-three/drei";

export default function LoaderScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: 'white', fontFamily: 'Inter', fontWeight: 900, textAlign: 'center', width: '300px' }}>
        <div style={{ fontSize: '3rem' }}>{progress.toFixed(0)}%</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '10px' }}>CHARGEMENT DE LA GALERIE</div>
      </div>
    </Html>
  );
}