import { useState, useEffect } from "react";

function Typewriter({ text, delay = 0, speed = 50, style }) {
  const [displayText, setDisplayText] = useState("");
  const [startTyping, setStartTyping] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStartTyping(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!startTyping) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++; if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, startTyping]);
  return <div style={style}>{displayText}</div>;
}

export default function IntroOverlay({ isVisible, onEnter }) {
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