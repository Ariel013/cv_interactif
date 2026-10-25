"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox, Text } from "@react-three/drei";
import { couleurs, RAYON_DECOUVERTE, RAYON_ILE, type Zone } from "./zones";
import { sonPas } from "./sons";

// La scène de l'île. Le personnage se déplace au clic sur le sol (ou au
// toucher) et au clavier ; s'approcher d'un lieu le découvre.

const POLICE = "/polices/Inter-ExtraBold.ttf";
const VITESSE = 7.5;

// Direction du joystick tactile, de -1 à 1 sur chaque axe ; écrite par le
// joystick, lue à chaque image (une référence, pas un état React).
export type Manette = { x: number; z: number };

export type Commandes = {
  // Lieu visé par la liste « Aller à… » : le personnage y marche.
  allerA: { x: number; z: number; jeton: number } | null;
};

type Props = {
  zones: Zone[];
  decouverts: Set<string>;
  titres: {
    nom: string;
    titre: string;
    quartiers: { projets: string; parcours: string; competences: string; contact: string };
    natures: { formation: string; experience: string };
  };
  commandes: Commandes;
  manette: React.RefObject<Manette>;
  surProche: (id: string | null) => void;
  surDeplacement: () => void;
  surPret: () => void;
  // Perte du contexte WebGL (GPU saturé, onglet en veille) : retour au secours.
  surPerte: () => void;
  // Avant « Commencer » : vue d'ensemble qui tourne autour de l'île.
  demarre: boolean;
};

// Sol à points, comme le fond du portfolio.
function texturePoints() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.arc(32, 32, 3, 0, Math.PI * 2);
  ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(36, 36);
  t.anisotropy = 4;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Ile({ surSol }: { surSol: (p: THREE.Vector3) => void }) {
  const texture = useMemo(() => texturePoints(), []);
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          surSol(e.point);
        }}
      >
        <circleGeometry args={[RAYON_ILE, 96]} />
        <meshStandardMaterial map={texture} roughness={0.95} />
      </mesh>
      {/* Tranche de l'île, en dégradé indigo vers le bas. */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[RAYON_ILE, RAYON_ILE * 0.82, 3.2, 96, 1, true]} />
        <meshStandardMaterial color="#c7d2fe" side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
      <mesh position={[0, -3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[RAYON_ILE * 0.82, 96]} />
        <meshStandardMaterial color="#a5b4fc" />
      </mesh>
    </group>
  );
}

// L'explorateur : un personnage stylisé aux couleurs du portfolio.
function Personnage({
  position,
  enMouvement,
}: {
  position: React.RefObject<THREE.Vector3>;
  enMouvement: React.RefObject<boolean>;
}) {
  const groupe = useRef<THREE.Group>(null);
  const corps = useRef<THREE.Group>(null);
  const jambeG = useRef<THREE.Group>(null);
  const jambeD = useRef<THREE.Group>(null);
  const brasG = useRef<THREE.Group>(null);
  const brasD = useRef<THREE.Group>(null);
  const direction = useRef(0);
  const temps = useRef(0);
  const dernier = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!groupe.current || !corps.current) return;
    const p = position.current;
    const dx = p.x - dernier.current.x;
    const dz = p.z - dernier.current.z;
    if (dx * dx + dz * dz > 1e-6) direction.current = Math.atan2(dx, dz);
    dernier.current.copy(p);
    groupe.current.position.set(p.x, 0, p.z);
    corps.current.rotation.y = THREE.MathUtils.damp(corps.current.rotation.y, direction.current, 12, delta);
    const marche = enMouvement.current;
    temps.current += delta * (marche ? 11 : 1.5);
    const balance = marche ? Math.sin(temps.current) * 0.65 : 0;
    for (const [ref, signe] of [
      [jambeG, 1],
      [jambeD, -1],
      [brasG, -1],
      [brasD, 1],
    ] as const) {
      if (ref.current) ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, balance * signe, 14, delta);
    }
    corps.current.position.y = marche ? Math.abs(Math.cos(temps.current)) * 0.06 : Math.sin(temps.current) * 0.015;
  });

  const membre = (longueur: number, rayon: number, couleur: string) => (
    <mesh position={[0, -longueur / 2, 0]} castShadow>
      <capsuleGeometry args={[rayon, longueur - rayon * 2, 6, 12]} />
      <meshStandardMaterial color={couleur} roughness={0.55} />
    </mesh>
  );

  return (
    <group ref={groupe}>
      <group ref={corps}>
        {/* Jambes */}
        <group ref={jambeG} position={[-0.14, 0.82, 0]}>
          {membre(0.82, 0.11, "#1e293b")}
        </group>
        <group ref={jambeD} position={[0.14, 0.82, 0]}>
          {membre(0.82, 0.11, "#1e293b")}
        </group>
        {/* Buste, aux couleurs du portfolio */}
        <mesh position={[0, 1.18, 0]} castShadow>
          <capsuleGeometry args={[0.27, 0.42, 8, 16]} />
          <meshStandardMaterial color={couleurs.indigo} roughness={0.5} />
        </mesh>
        <group ref={brasG} position={[-0.36, 1.45, 0]}>
          {membre(0.68, 0.085, couleurs.indigo)}
        </group>
        <group ref={brasD} position={[0.36, 1.45, 0]}>
          {membre(0.68, 0.085, couleurs.indigo)}
        </group>
        {/* Tête stylisée, sans photo (choix de Kevin). */}
        <mesh position={[0, 1.66, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.12, 12]} />
          <meshStandardMaterial color="#6b4423" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.92, 0]} castShadow>
          <sphereGeometry args={[0.26, 32, 24]} />
          <meshStandardMaterial color="#6b4423" roughness={0.55} />
        </mesh>
        {/* Cheveux courts : une calotte sombre sur le haut du crâne. */}
        <mesh position={[0, 1.96, -0.01]} castShadow>
          <sphereGeometry args={[0.27, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
        {/* Yeux, tournés vers l'avant. */}
        <mesh position={[-0.09, 1.95, 0.235]}>
          <sphereGeometry args={[0.03, 12, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.09, 1.95, 0.235]}>
          <sphereGeometry args={[0.03, 12, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.5, 0.62, 40]} />
        <meshBasicMaterial color={couleurs.cyan} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Socle({ zone, decouvert }: { zone: Zone; decouvert: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[zone.x, 0.015, zone.z]}>
      <ringGeometry args={[RAYON_DECOUVERTE * 0.72, RAYON_DECOUVERTE * 0.8, 48]} />
      <meshBasicMaterial color={decouvert ? zone.couleur : "#94a3b8"} transparent opacity={decouvert ? 0.9 : 0.45} />
    </mesh>
  );
}

// Un projet : un panneau debout. Son nom n'apparaît qu'une fois découvert.
function Panneau({ zone, decouvert, numero }: { zone: Zone; decouvert: boolean; numero: number }) {
  const regard = Math.atan2(-zone.x, -zone.z);
  return (
    <group rotation={[0, regard, 0]}>
      <RoundedBox args={[2.6, 1.8, 0.28]} radius={0.12} position={[0, 1.75, -1.1]} castShadow>
        <meshStandardMaterial color={decouvert ? zone.couleur : "#e2e8f0"} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.45, -1.1]} castShadow>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <Text font={POLICE} position={[0, 2.25, -0.95]} fontSize={0.26} color={decouvert ? "#e0e7ff" : "#64748b"} anchorX="center">
        {String(numero).padStart(2, "0")}
      </Text>
      <Text
        font={POLICE}
        position={[0, 1.6, -0.95]}
        fontSize={decouvert ? 0.3 : 0.6}
        maxWidth={2.3}
        textAlign="center"
        lineHeight={1.05}
        color={decouvert ? "#ffffff" : "#94a3b8"}
        anchorX="center"
        anchorY="middle"
      >
        {decouvert ? zone.etiquette : "?"}
      </Text>
      <Socle zone={{ ...zone, x: 0, z: 0 }} decouvert={decouvert} />
    </group>
  );
}


// Révélation d'un lieu : quand il passe de « inconnu » à « découvert », il
// saute et fait un tour sur lui-même, et une onde et des éclats de sa couleur
// partent du sol. Rien à l'affichage initial d'un lieu déjà découvert.
function Revelation({ zone, decouvert, children }: { zone: Zone; decouvert: boolean; children: React.ReactNode }) {
  const groupe = useRef<THREE.Group>(null);
  const onde = useRef<THREE.Mesh>(null);
  const eclats = useRef<THREE.InstancedMesh>(null);
  const debut = useRef<number | null>(null);
  const avant = useRef(decouvert);
  // L'effet n'est monté que pendant l'animation : rien ne pèse sur la scène
  // le reste du temps.
  const [enCours, setEnCours] = useState(false);
  const factice = useMemo(() => new THREE.Object3D(), []);
  const directions = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * (1.4 + (i % 3) * 0.5), 3 + (i % 4) * 0.8, Math.sin(a) * (1.4 + (i % 3) * 0.5));
      }),
    [],
  );

  useEffect(() => {
    if (decouvert && !avant.current) {
      debut.current = null;
      setEnCours(true);
    }
    avant.current = decouvert;
  }, [decouvert]);

  useFrame((etat) => {
    if (!enCours) return;
    if (debut.current === null) debut.current = etat.clock.elapsedTime;
    const g = groupe.current;
    if (!g) return;
    const t = etat.clock.elapsedTime - debut.current;
    const d = 1.1;
    if (t > d) {
      g.scale.setScalar(1);
      g.rotation.y = 0;
      g.position.y = 0;
      setEnCours(false);
      return;
    }
    const k = t / d;
    const sortie = 1 - Math.pow(1 - k, 3);
    // Saut et tour complet, amortis.
    g.rotation.y = sortie * Math.PI * 2;
    g.scale.setScalar(1 + Math.sin(Math.min(1, k * 1.6) * Math.PI) * 0.28);
    g.position.y = Math.sin(Math.min(1, k * 1.4) * Math.PI) * 0.6;
    if (onde.current) {
      onde.current.scale.setScalar(1 + sortie * 3.2);
      (onde.current.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - k);
    }
    if (eclats.current) {
      directions.forEach((v, i) => {
        factice.position.set(v.x * sortie, 0.4 + v.y * t - 4.5 * t * t, v.z * sortie);
        factice.rotation.set(t * 8 + i, t * 6, 0);
        factice.scale.setScalar(Math.max(0.01, 1 - k));
        factice.updateMatrix();
        eclats.current!.setMatrixAt(i, factice.matrix);
      });
      eclats.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[zone.x, 0, zone.z]}>
      <group ref={groupe}>{children}</group>
      {enCours && (
        <>
          <mesh ref={onde} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <ringGeometry args={[0.9, 1.05, 48]} />
            <meshBasicMaterial color={zone.couleur} transparent opacity={0.7} />
          </mesh>
          <instancedMesh ref={eclats} args={[undefined, undefined, directions.length]}>
            <boxGeometry args={[0.16, 0.16, 0.16]} />
            <meshStandardMaterial color={zone.couleur} emissive={zone.couleur} emissiveIntensity={0.35} />
          </instancedMesh>
        </>
      )}
    </group>
  );
}

function Jalon({ zone, decouvert, nature }: { zone: Zone; decouvert: boolean; nature: string }) {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.1, 0.4, 32]} />
        <meshStandardMaterial color={decouvert ? zone.couleur : "#e2e8f0"} roughness={0.5} />
      </mesh>
      <Float speed={2} floatIntensity={0.4} rotationIntensity={0}>
        <Text font={POLICE} position={[0, 1.4, 0]} fontSize={0.62} color={decouvert ? couleurs.indigoFonce : "#94a3b8"} anchorX="center">
          {zone.etiquette}
        </Text>
        <Text font={POLICE} position={[0, 0.9, 0]} fontSize={0.26} color={decouvert ? zone.couleur : "#94a3b8"} anchorX="center" letterSpacing={0.04}>
          {nature.toUpperCase()}
        </Text>
      </Float>
    </group>
  );
}

function Cristal({ zone, decouvert }: { zone: Zone; decouvert: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * (decouvert ? 0.9 : 0.35);
  });
  return (
    <group>
      <Float speed={1.6} floatIntensity={0.6} rotationIntensity={0.15}>
        <mesh ref={ref} position={[0, 1.5, 0]} castShadow>
          <octahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial
            color={decouvert ? zone.couleur : "#cbd5e1"}
            emissive={decouvert ? zone.couleur : "#000000"}
            emissiveIntensity={decouvert ? 0.35 : 0}
            roughness={0.15}
            metalness={0.1}
            flatShading
          />
        </mesh>
      </Float>
      {decouvert && (
        <Text font={POLICE} position={[0, 2.8, 0]} fontSize={0.3} color={couleurs.indigoFonce} anchorX="center" maxWidth={3} textAlign="center">
          {zone.etiquette}
        </Text>
      )}
      <Socle zone={{ ...zone, x: 0, z: 0 }} decouvert={decouvert} />
    </group>
  );
}

function Portail({ zone, decouvert }: { zone: Zone; decouvert: boolean }) {
  const anneau = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (anneau.current) anneau.current.rotation.z += delta * 0.6;
  });
  return (
    <group>
      <mesh ref={anneau} position={[0, 2.1, 0]} castShadow>
        <torusGeometry args={[1.7, 0.2, 20, 64]} />
        <meshStandardMaterial color={couleurs.indigo} emissive={couleurs.cyan} emissiveIntensity={decouvert ? 0.6 : 0.15} roughness={0.25} />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color={couleurs.cyan} transparent opacity={decouvert ? 0.28 : 0.12} side={THREE.DoubleSide} />
      </mesh>
      <Socle zone={{ ...zone, x: 0, z: 0 }} decouvert={decouvert} />
    </group>
  );
}

// Nom au sol près du départ, et noms des quartiers : ce qu'on voit d'en haut.
function Panneaux({ titres }: { titres: Props["titres"] }) {
  const sol = (texte: string, x: number, z: number, taille: number, couleur: string) => (
    <Text font={POLICE} position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]} fontSize={taille} color={couleur} anchorX="center" anchorY="middle" letterSpacing={0.06}>
      {texte}
    </Text>
  );
  return (
    <>
      <Text font={POLICE} position={[0, 0.03, 3.4]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.15} color={couleurs.indigo} anchorX="center" maxWidth={16} textAlign="center" lineHeight={1}>
        {titres.nom}
      </Text>
      <Text font={POLICE} position={[0, 0.03, 5.1]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.48} color="#475569" anchorX="center">
        {titres.titre}
      </Text>
      {sol(titres.quartiers.projets.toUpperCase(), 0, -6.5, 0.7, "#6366f1")}
      {sol(titres.quartiers.parcours.toUpperCase(), 12.5, -2.2, 0.7, "#0d9488")}
      {sol(titres.quartiers.competences.toUpperCase(), -12, 6, 0.62, "#7c3aed")}
      {sol(titres.quartiers.contact.toUpperCase(), 0, 12.8, 0.7, "#0891b2")}
    </>
  );
}


// Décor : arbres bas-poly et chemins vers les quartiers, pour que l'île ait
// l'air d'un lieu et non d'un plateau.
function Decor({ zones }: { zones: Zone[] }) {
  const arbres = useMemo(() => {
    const liste: { x: number; z: number; h: number; c: string }[] = [];
    let graine = 7;
    const hasard = () => {
      graine = (graine * 16807) % 2147483647;
      return graine / 2147483647;
    };
    const teintes = ["#818cf8", "#6366f1", "#22d3ee", "#67e8f9", "#a5b4fc"];
    for (let i = 0; liste.length < 46 && i < 600; i++) {
      const a = hasard() * Math.PI * 2;
      const r = 9 + hasard() * (RAYON_ILE - 10.5);
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const libre = zones.every((zo) => Math.hypot(zo.x - x, zo.z - z) > 3.4) && Math.hypot(x, z - 4) > 6;
      const chemin = Math.abs(x) < 1.6 || Math.abs(z) < 1.6;
      if (libre && !chemin) liste.push({ x, z, h: 0.9 + hasard() * 1.2, c: teintes[Math.floor(hasard() * teintes.length)] });
    }
    return liste;
  }, [zones]);
  return (
    <>
      {arbres.map((a, i) => (
        <group key={i} position={[a.x, 0, a.z]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.5, 6]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0, 0.5 + a.h / 2, 0]} castShadow>
            <coneGeometry args={[a.h * 0.42, a.h, 6]} />
            <meshStandardMaterial color={a.c} flatShading roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Chemins en pointillés vers les quatre quartiers. */}
      {[
        [0, -1, 9],
        [1, 0, 8],
        [-1, 0, 8],
        [0, 1, 11],
      ].map(([dx, dz, n], k) =>
        Array.from({ length: n }, (_, i) => (
          <mesh key={`${k}-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[dx * (2.2 + i * 1.1), 0.02, dz * (2.2 + i * 1.1)]}>
            <circleGeometry args={[0.18, 16]} />
            <meshBasicMaterial color="#a5b4fc" />
          </mesh>
        )),
      )}
    </>
  );
}

// Le guide vers le contact : un triangle posé au sol juste devant le
// personnage, qui pointe toujours vers le portail de contact, où qu'on aille.
// Il s'efface une fois arrivé.
function Boussole({ position, vers }: { position: React.RefObject<THREE.Vector3>; vers: { x: number; z: number } }) {
  const groupe = useRef<THREE.Group>(null);
  const fleche = useRef<THREE.Mesh>(null);
  const temps = useRef(0);
  const forme = useMemo(() => {
    const f = new THREE.Shape();
    f.moveTo(0, 0.5);
    f.lineTo(-0.36, -0.2);
    f.lineTo(0, -0.06);
    f.lineTo(0.36, -0.2);
    f.closePath();
    return f;
  }, []);

  useFrame((_, delta) => {
    const g = groupe.current;
    if (!g || !fleche.current) return;
    const p = position.current;
    const dx = vers.x - p.x;
    const dz = vers.z - p.z;
    g.visible = Math.hypot(dx, dz) > RAYON_DECOUVERTE;
    g.position.set(p.x, 0.05, p.z);
    g.rotation.y = Math.atan2(dx, dz);
    // Petit va-et-vient vers l'avant, pour attirer l'œil sans gêner.
    temps.current += delta;
    fleche.current.position.z = 1.15 + Math.sin(temps.current * 4) * 0.1;
  });

  return (
    <group ref={groupe}>
      <mesh ref={fleche} rotation={[Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[forme]} />
        <meshBasicMaterial color={couleurs.cyan} side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Jeu({ zones, decouverts, titres, commandes, manette, surProche, surDeplacement, demarre }: Omit<Props, "surPret" | "surPerte">) {
  const position = useRef(new THREE.Vector3(0, 0, 1.2));
  const cible = useRef<THREE.Vector3 | null>(null);
  const enMouvement = useRef(false);
  const touches = useRef(new Set<string>());
  const proche = useRef<string | null>(null);
  const aBouge = useRef(false);
  const cadencePas = useRef(0);
  const { camera, size } = useThree();
  const portrait = size.width < size.height;
  const decalageCamera = useMemo(() => new THREE.Vector3(0, portrait ? 24 : 17, portrait ? 19 : 15), [portrait]);
  const orbite = useRef(0);
  const contact = zones.find((z) => z.type === "contact");

  useEffect(() => {
    camera.position.copy(position.current).add(decalageCamera).add(new THREE.Vector3(0, 10, 10));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (commandes.allerA) cible.current = new THREE.Vector3(commandes.allerA.x, 0, commandes.allerA.z + RAYON_DECOUVERTE * 0.6);
  }, [commandes.allerA]);

  useEffect(() => {
    const codes = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"];
    const bas = (e: KeyboardEvent) => {
      if (!codes.includes(e.code)) return;
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(t.tagName)) return;
      e.preventDefault();
      touches.current.add(e.code);
      cible.current = null;
    };
    const haut = (e: KeyboardEvent) => touches.current.delete(e.code);
    // Une touche relâchée hors de la fenêtre (Alt+Tab) ne doit pas faire
    // marcher le personnage indéfiniment.
    const vider = () => touches.current.clear();
    window.addEventListener("keydown", bas);
    window.addEventListener("keyup", haut);
    window.addEventListener("blur", vider);
    document.addEventListener("visibilitychange", vider);
    return () => {
      window.removeEventListener("keydown", bas);
      window.removeEventListener("keyup", haut);
      window.removeEventListener("blur", vider);
      document.removeEventListener("visibilitychange", vider);
    };
  }, []);

  useFrame((_, delta) => {
    if (!demarre) {
      // Écran titre : la caméra tourne lentement au-dessus de l'île.
      orbite.current += delta * 0.08;
      const r = portrait ? 46 : 36;
      camera.position.lerp(new THREE.Vector3(Math.sin(orbite.current) * r, portrait ? 40 : 26, Math.cos(orbite.current) * r), 1 - Math.exp(-1.5 * delta));
      camera.lookAt(0, 0, 0);
      return;
    }
    const p = position.current;
    const pas = new THREE.Vector3();
    const t = touches.current;
    // Clavier : ZQSD (codes physiques WASD) ou flèches, dans l'axe de la caméra.
    if (t.has("ArrowUp") || t.has("KeyW")) pas.z -= 1;
    if (t.has("ArrowDown") || t.has("KeyS")) pas.z += 1;
    if (t.has("ArrowLeft") || t.has("KeyA")) pas.x -= 1;
    if (t.has("ArrowRight") || t.has("KeyD")) pas.x += 1;
    // Joystick tactile : direction et vitesse proportionnelles à l'inclinaison.
    let allure = 1;
    const m = manette.current;
    if (pas.lengthSq() === 0 && m && Math.hypot(m.x, m.z) > 0.12) {
      pas.set(m.x, 0, m.z);
      allure = Math.min(1, Math.hypot(m.x, m.z));
      cible.current = null;
    }
    if (pas.lengthSq() === 0 && cible.current) {
      pas.subVectors(cible.current, p).setY(0);
      if (pas.length() < 0.15) {
        cible.current = null;
        pas.set(0, 0, 0);
      }
    }
    enMouvement.current = pas.lengthSq() > 0;
    // Un bruit de pas toutes les 0,3 s de marche.
    if (enMouvement.current) {
      cadencePas.current += delta;
      if (cadencePas.current > 0.3) {
        cadencePas.current = 0;
        sonPas();
      }
    }
    if (enMouvement.current) {
      pas.normalize().multiplyScalar(Math.min(VITESSE * allure * delta, cible.current ? p.distanceTo(cible.current) : Infinity));
      p.add(pas);
      if (p.length() > RAYON_ILE - 1.2) p.setLength(RAYON_ILE - 1.2);
      if (!aBouge.current) {
        aBouge.current = true;
        surDeplacement();
      }
    }

    // Lieu le plus proche, dans le rayon de découverte.
    let trouve: string | null = null;
    let meilleur = RAYON_DECOUVERTE;
    for (const z of zones) {
      const d = Math.hypot(z.x - p.x, z.z - p.z);
      if (d < meilleur) {
        meilleur = d;
        trouve = z.id;
      }
    }
    if (trouve !== proche.current) {
      proche.current = trouve;
      surProche(trouve);
    }

    // Caméra à la troisième personne, en surplomb.
    const vise = p.clone().add(decalageCamera);
    camera.position.lerp(vise, 1 - Math.exp(-2.2 * delta));
    camera.lookAt(p.x, 0.6, p.z - 1.5);
  });

  let numero = 0;
  return (
    <>
      <Ile
        surSol={(point) => {
          cible.current = new THREE.Vector3(point.x, 0, point.z);
        }}
      />
      <Panneaux titres={titres} />
      <Decor zones={zones} />
      {zones.map((z) => {
        const vu = decouverts.has(z.id);
        let lieu: React.ReactNode = null;
        if (z.type === "projet") lieu = <Panneau zone={z} decouvert={vu} numero={++numero} />;
        if (z.type === "parcours") lieu = <Jalon zone={z} decouvert={vu} nature={z.nature === "formation" ? titres.natures.formation : titres.natures.experience} />;
        if (z.type === "competence") lieu = <Cristal zone={z} decouvert={vu} />;
        if (z.type === "contact") lieu = <Portail zone={z} decouvert={vu} />;
        if (!lieu) return null;
        return (
          <Revelation key={z.id} zone={z} decouvert={vu}>
            {lieu}
          </Revelation>
        );
      })}
      <Personnage position={position} enMouvement={enMouvement} />
      {demarre && contact && <Boussole position={position} vers={contact} />}
      <ContactShadows position={[0, 0.02, 0]} scale={RAYON_ILE * 2} resolution={1024} blur={2.4} opacity={0.35} far={6} />
    </>
  );
}

function Pret({ surPret }: { surPret: () => void }) {
  useEffect(() => {
    // Une image plus tard : la scène est dessinée avant d'être montrée.
    const id = requestAnimationFrame(() => surPret());
    return () => cancelAnimationFrame(id);
  }, [surPret]);
  return null;
}

export default function SceneMonde(props: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 38, near: 0.1, far: 200 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", () => props.surPerte(), { once: true });
      }}
      aria-hidden="true"
    >
      <hemisphereLight args={["#ffffff", "#c7d2fe", 2.2]} />
      <directionalLight
        position={[12, 22, 10]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
      />
      <Suspense fallback={null}>
      <Jeu
        zones={props.zones}
        decouverts={props.decouverts}
        titres={props.titres}
        commandes={props.commandes}
        manette={props.manette}
        surProche={props.surProche}
        surDeplacement={props.surDeplacement}
        demarre={props.demarre}
      />
        {/* Monté seulement quand tout ce qui se charge (police des textes 3D)
            est prêt : c'est le vrai signal « l'île est prête ». */}
        <Pret surPret={props.surPret} />
      </Suspense>
    </Canvas>
  );
}
