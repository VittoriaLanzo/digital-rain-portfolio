import { useRef, useMemo, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import * as THREE from 'three';



/* ─── Constants ─── */
const MATRIX_GREEN = '#00FF88';
const NEON_CYAN = '#00D4FF';
const ACCENT_VIOLET = '#6E6EFF';

function useIsMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

/* ─── Procedural Textures ─── */
function createProceduralTexture(
  width: number, height: number,
  drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  drawFn(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function useProceduralTextures() {
  return useMemo(() => {
    // High-res brick for near buildings
    const brickMap = createProceduralTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#2A2E28';
      ctx.fillRect(0, 0, w, h);
      const brickW = 52, brickH = 22, mortarW = 3;
      for (let row = 0; row < 24; row++) {
        const offsetX = row % 2 === 0 ? 0 : brickW / 2;
        for (let col = -1; col < 12; col++) {
          const x = col * (brickW + mortarW) + offsetX;
          const y = row * (brickH + mortarW);
          const v = 35 + Math.floor(Math.random() * 25);
          ctx.fillStyle = `rgb(${v + 15}, ${v + 18}, ${v})`;
          ctx.fillRect(x + 1, y + 1, brickW - 1, brickH - 1);
          // Add subtle variation within each brick
          for (let s = 0; s < 3; s++) {
            const sv = v + Math.floor(Math.random() * 10) - 5;
            ctx.fillStyle = `rgba(${sv + 15}, ${sv + 18}, ${sv}, 0.3)`;
            ctx.fillRect(x + 1 + Math.random() * (brickW - 4), y + 1 + Math.random() * (brickH - 4), 4 + Math.random() * 8, 2 + Math.random() * 4);
          }
        }
      }
      ctx.strokeStyle = '#2E3228';
      ctx.lineWidth = mortarW;
      for (let row = 0; row <= 24; row++) {
        const y = row * (brickH + mortarW);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      // Add stains and weathering
      for (let i = 0; i < 15; i++) {
        const gx = Math.random() * w, gy = Math.random() * h;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 20 + Math.random() * 30);
        grad.addColorStop(0, 'rgba(20, 20, 15, 0.15)');
        grad.addColorStop(1, 'rgba(20, 20, 15, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(gx - 40, gy - 40, 80, 80);
      }
    });
    brickMap.repeat.set(3, 6);

    const roadMap = createProceduralTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#2E2E2E';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 10000; i++) {
        const v = Math.random() * 255;
        ctx.fillStyle = `rgba(${v},${v},${v}, 0.03)`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
      }
      ctx.strokeStyle = '#383838';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        let cx = Math.random() * w, cy = Math.random() * h;
        ctx.moveTo(cx, cy);
        for (let j = 0; j < 8; j++) {
          cx += (Math.random() - 0.5) * 80;
          cy += (Math.random() - 0.5) * 80;
          ctx.quadraticCurveTo(cx + (Math.random() - 0.5) * 30, cy + (Math.random() - 0.5) * 30, cx, cy);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(w * 0.35, 0); ctx.lineTo(w * 0.35, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.65, 0); ctx.lineTo(w * 0.65, h); ctx.stroke();
    });
    roadMap.repeat.set(8, 40);

    const sidewalkMap = createProceduralTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#3A3A3A';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 3000; i++) {
        const v = 30 + Math.random() * 30;
        ctx.fillStyle = `rgba(${v},${v},${v}, 0.5)`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
      ctx.strokeStyle = 'rgba(80,80,80,0.6)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    });
    sidewalkMap.repeat.set(6, 6);

    return { roadMap, brickMap, sidewalkMap };
  }, []);
}

/* ─── Building ─── */
interface BuildingData {
  pos: [number, number, number];
  w: number; h: number; d: number;
  trims: { y: number; color: string; hasLight: boolean }[];
  windows: { x: number; y: number; z: number; on: boolean; color: string }[];
  hasFireEscape: boolean;
  fireEscapeY: number;
  side: number; // -1 = left of road, 1 = right of road
  hasBalcony: boolean;
  balconyFloors: number[];
  hasWaterTower: boolean;
  hasAntenna: boolean;
  doorPositions: number[];
  // Road-facing face info (inner X-face)
  roadFaceX: number;       // local X of road-facing face
  roadFaceDir: number;     // +1 or -1, direction face normal points (toward road)
  roadWindows: { z: number; y: number; on: boolean; color: string }[];
}

/* LOD thresholds — distance from camera */
const LOD_NEAR = 40;   // full detail
const LOD_MID = 80;    // no fire escapes, balconies, doors, reduced windows
// beyond LOD_MID = simple box with emissive windows baked

function Building({ data, brickMap }: { data: BuildingData; brickMap: THREE.Texture }) {
  const { pos, w, h, d, trims, windows, hasFireEscape, side, hasBalcony, balconyFloors, hasWaterTower, hasAntenna, doorPositions, roadFaceX, roadFaceDir, roadWindows } = data;
  const groupRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Mesh>(null);
  const faceZ = side * (d / 2 + 0.01);
  const [lod, setLod] = useState<0 | 1 | 2>(2);

  // Rotation for planes on the road-facing X-face: face toward road
  // roadFaceDir=+1 means face points +X → rotate plane -PI/2 around Y
  // roadFaceDir=-1 means face points -X → rotate plane +PI/2 around Y
  const roadFaceRotY = -roadFaceDir * Math.PI / 2;

  useFrame(({ camera, clock }) => {
    if (!groupRef.current) return;
    const dx = camera.position.x - pos[0];
    const dz = camera.position.z - pos[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    const newLod: 0 | 1 | 2 = dist < LOD_NEAR ? 0 : dist < LOD_MID ? 1 : 2;
    if (newLod !== lod) setLod(newLod);
    if (antennaRef.current && hasAntenna && lod === 0) {
      const intensity = 2 + Math.sin(clock.getElapsedTime() * 3) * 3;
      (antennaRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = Math.max(0, intensity);
    }
  });

  const fireEscapeLandings = useMemo(() => {
    if (!hasFireEscape) return [];
    const landings: number[] = [];
    const startY = 4;
    const spacing = Math.min(6, (h - 4) / 3);
    for (let i = 0; i < 4 && startY + i * spacing < h - 2; i++) {
      landings.push(startY + i * spacing);
    }
    return landings;
  }, [hasFireEscape, h]);

  const litWindowCount = useMemo(() => roadWindows.filter(w => w.on).length + windows.filter(w => w.on).length, [windows, roadWindows]);
  const totalWindows = windows.length + roadWindows.length;
  const litRatio = totalWindows > 0 ? litWindowCount / totalWindows : 0;

  // ═══ FAR LOD ═══
  if (lod === 2) {
    return (
      <group ref={groupRef} position={pos}>
        <mesh frustumCulled>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial map={brickMap} roughness={0.85} metalness={0} color="#DDDDDD" emissive="#AAFF88" emissiveIntensity={litRatio * 0.15} />
        </mesh>
        {/* Road-facing trim */}
        {trims.length > 0 && (
          <mesh position={[roadFaceX + roadFaceDir * 0.03, trims[0].y - h / 2, 0]} rotation={[0, roadFaceRotY, 0]}>
            <planeGeometry args={[d, 0.12]} />
            <meshStandardMaterial color="#000" emissive={trims[0].color} emissiveIntensity={4} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    );
  }

  // ═══ MID LOD ═══
  if (lod === 1) {
    const midRoadWindows = roadWindows.filter((_, i) => i % 2 === 0);
    return (
      <group ref={groupRef} position={pos}>
        <mesh frustumCulled>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial map={brickMap} roughness={0.85} metalness={0} color="#DDDDDD" emissive="#222218" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, h / 2 + 0.15, 0]}>
          <boxGeometry args={[w + 0.2, 0.3, d + 0.2]} />
          <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Road-facing trims */}
        {trims.map((trim, i) => (
          <mesh key={`rt${i}`} position={[roadFaceX + roadFaceDir * 0.03, trim.y - h / 2, 0]} rotation={[0, roadFaceRotY, 0]}>
            <planeGeometry args={[d, 0.12]} />
            <meshStandardMaterial color="#000" emissive={trim.color} emissiveIntensity={4} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* Road-facing windows */}
        {midRoadWindows.map((win, i) => (
          <mesh key={`rw${i}`} position={[roadFaceX + roadFaceDir * 0.02, win.y, win.z]} rotation={[0, roadFaceRotY, 0]}>
            <planeGeometry args={[0.55, 0.75]} />
            <meshStandardMaterial
              color={win.on ? '#001A00' : '#050508'}
              emissive={win.on ? win.color : '#000000'}
              emissiveIntensity={win.on ? 1.2 : 0}
              transparent opacity={win.on ? 0.9 : 0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        {/* Z-face trims */}
        {trims.map((trim, i) => (
          <mesh key={`t${i}`} position={[0, trim.y - h / 2, side * (d / 2 + 0.04)]}>
            <boxGeometry args={[w, 0.12, 0.08]} />
            <meshStandardMaterial color="#000" emissive={trim.color} emissiveIntensity={4} />
          </mesh>
        ))}
        <mesh position={[w * 0.2, h / 2 + 0.55, 0]}>
          <boxGeometry args={[1.5, 0.8, 1.5]} />
          <meshStandardMaterial color="#181820" metalness={0.7} roughness={0.5} />
        </mesh>
      </group>
    );
  }

  // ═══ FULL LOD ═══
  return (
    <group ref={groupRef} position={pos}>
      <mesh frustumCulled>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial map={brickMap} roughness={0.85} metalness={0} color="#DDDDDD" emissive="#222218" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, h / 2 + 0.15, 0]}>
        <boxGeometry args={[w + 0.2, 0.3, d + 0.2]} />
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* ── Road-facing trims ── */}
      {trims.map((trim, i) => (
        <group key={`rt${i}`}>
          <mesh position={[roadFaceX + roadFaceDir * 0.03, trim.y - h / 2, 0]} rotation={[0, roadFaceRotY, 0]}>
            <planeGeometry args={[d, 0.12]} />
            <meshStandardMaterial color="#000" emissive={trim.color} emissiveIntensity={4} side={THREE.DoubleSide} />
          </mesh>
          {trim.hasLight && (
            <pointLight position={[roadFaceX + roadFaceDir * 1, trim.y - h / 2, 0]} color={trim.color} intensity={2} distance={8} decay={2} />
          )}
        </group>
      ))}

      {/* ── Road-facing windows with recessed frames ── */}
      {roadWindows.map((win, i) => (
        <group key={`rw${i}`} position={[roadFaceX, win.y, win.z]} rotation={[0, roadFaceRotY, 0]}>
          <mesh position={[0, 0, -0.06]}>
            <boxGeometry args={[0.7, 0.9, 0.12]} />
            <meshStandardMaterial color="#151520" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.55, 0.75]} />
            <meshStandardMaterial
              color={win.on ? '#001A00' : '#050508'}
              emissive={win.on ? win.color : '#000000'}
              emissiveIntensity={win.on ? 1.2 : 0}
              transparent opacity={win.on ? 0.9 : 0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, -0.48, 0.07]}>
            <boxGeometry args={[0.8, 0.06, 0.15]} />
            <meshStandardMaterial color="#2A2A38" metalness={0.6} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* ── Road-facing doors ── */}
      {doorPositions.map((_, i) => {
        const dz = d > 6 ? (i === 0 ? -1.5 : 1.5) : 0;
        return (
          <group key={`rdoor${i}`} position={[roadFaceX + roadFaceDir * 0.02, -h / 2 + 1.1, dz]} rotation={[0, roadFaceRotY, 0]}>
            <mesh>
              <boxGeometry args={[1.0, 2.2, 0.1]} />
              <meshStandardMaterial color="#181828" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <boxGeometry args={[0.85, 2.0, 0.05]} />
              <meshStandardMaterial color="#121220" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0.3, 0, 0.08]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#000" emissive={ACCENT_VIOLET} emissiveIntensity={1.5} />
            </mesh>
            <mesh position={[0, 1.2, 0.03]}>
              <boxGeometry args={[1.0, 0.2, 0.05]} />
              <meshStandardMaterial color="#000" emissive="#AAFF88" emissiveIntensity={2.0} />
            </mesh>
          </group>
        );
      })}

      {/* ── Road-facing balconies ── */}
      {hasBalcony && balconyFloors.map((by, i) => {
        const bw = d * 0.4;
        return (
          <group key={`rbal${i}`} position={[roadFaceX + roadFaceDir * 0.6, by - h / 2, 0]} rotation={[0, roadFaceRotY, 0]}>
            <mesh>
              <boxGeometry args={[bw, 0.12, 1.2]} />
              <meshStandardMaterial color="#222232" metalness={0.5} roughness={0.6} />
            </mesh>
            {[-bw / 2 + 0.1, 0, bw / 2 - 0.1].map((rx, ri) => (
              <mesh key={`rrail${ri}`} position={[rx, 0.46, 0]}>
                <boxGeometry args={[0.05, 0.8, 0.05]} />
                <meshStandardMaterial color="#2A2A3E" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
            <mesh position={[0, 0.86, 0]}>
              <boxGeometry args={[bw, 0.05, 0.05]} />
              <meshStandardMaterial color="#2A2A3E" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        );
      })}

      {/* ── Road-facing fire escape ── */}
      {hasFireEscape && fireEscapeLandings.map((ly, i) => {
        const feOffset = roadFaceDir * (w / 2 + 0.9);
        return (
          <group key={`rfe${i}`}>
            <mesh position={[feOffset, ly - h / 2, 0]}>
              <boxGeometry args={[1.5, 0.08, 2.0]} />
              <meshStandardMaterial color="#2A2A3A" metalness={0.85} roughness={0.4} />
            </mesh>
            {i < fireEscapeLandings.length - 1 && (
              <>
                <mesh position={[feOffset, (ly + fireEscapeLandings[i + 1]) / 2 - h / 2, -0.8]}>
                  <boxGeometry args={[0.06, fireEscapeLandings[i + 1] - ly, 0.06]} />
                  <meshStandardMaterial color="#303040" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[feOffset, (ly + fireEscapeLandings[i + 1]) / 2 - h / 2, 0.8]}>
                  <boxGeometry args={[0.06, fireEscapeLandings[i + 1] - ly, 0.06]} />
                  <meshStandardMaterial color="#303040" metalness={0.9} roughness={0.2} />
                </mesh>
              </>
            )}
          </group>
        );
      })}
      {hasFireEscape && fireEscapeLandings.length > 0 && (
        <mesh position={[roadFaceDir * (w / 2 + 0.9), fireEscapeLandings[0] / 2 - h / 2, 0]}>
          <boxGeometry args={[0.06, fireEscapeLandings[0], 0.06]} />
          <meshStandardMaterial color="#303040" metalness={0.9} roughness={0.2} />
        </mesh>
      )}

      {/* ── Z-face trims (visible when approaching) ── */}
      {trims.map((trim, i) => (
        <mesh key={`t${i}`} position={[0, trim.y - h / 2, side * (d / 2 + 0.04)]}>
          <boxGeometry args={[w, 0.12, 0.08]} />
          <meshStandardMaterial color="#000" emissive={trim.color} emissiveIntensity={4} />
        </mesh>
      ))}

      {/* ── Z-face windows ── */}
      {windows.map((win, i) => (
        <group key={`w${i}`} position={[win.x, win.y, win.z]}>
          <mesh position={[0, 0, -0.06]}>
            <boxGeometry args={[0.7, 0.9, 0.12]} />
            <meshStandardMaterial color="#151520" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.55, 0.75]} />
            <meshStandardMaterial
              color={win.on ? '#001A00' : '#050508'}
              emissive={win.on ? win.color : '#000000'}
              emissiveIntensity={win.on ? 1.2 : 0}
              transparent opacity={win.on ? 0.9 : 0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, -0.48, 0.07]}>
            <boxGeometry args={[0.8, 0.06, 0.15]} />
            <meshStandardMaterial color="#2A2A38" metalness={0.6} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* HVAC */}
      <mesh position={[w * 0.2, h / 2 + 0.55, 0]}>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
        <meshStandardMaterial color="#181820" metalness={0.7} roughness={0.5} />
      </mesh>
      <mesh position={[w * 0.2, h / 2 + 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.04, 6, 12]} />
        <meshStandardMaterial color="#000" emissive="#004400" emissiveIntensity={0.5} />
      </mesh>

      {/* Water tower */}
      {hasWaterTower && (
        <group position={[-w * 0.25, h / 2 + 0.3, 0]}>
          {[[-0.4, 0, -0.4], [0.4, 0, -0.4], [-0.4, 0, 0.4], [0.4, 0, 0.4]].map(([lx, , lz], li) => (
            <mesh key={`leg${li}`} position={[lx, 1, lz]}>
              <boxGeometry args={[0.08, 2, 0.08]} />
              <meshStandardMaterial color="#1A1810" metalness={0.3} roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[0, 2.8, 0]}>
            <cylinderGeometry args={[0.6, 0.8, 2, 8]} />
            <meshStandardMaterial color="#1A1810" metalness={0.3} roughness={0.9} />
          </mesh>
          <mesh position={[0, 4.0, 0]}>
            <coneGeometry args={[0.7, 0.8, 8]} />
            <meshStandardMaterial color="#1A1810" metalness={0.3} roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* Antenna */}
      {hasAntenna && (
        <group position={[w * 0.3, h / 2 + 0.3, -d * 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 4, 6]} />
            <meshStandardMaterial color="#111118" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh ref={antennaRef} position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#000" emissive="#FF2222" emissiveIntensity={4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/* ─── Final Refined Victorian Street Lamp ─── */
function StreetLamp({ position, side }: { position: [number, number, number]; side: number }) {
  const lampColor = "#050505";
  const lightColor = "#ffbb55";
  const lanternX = side * -1.2;

  return (
    <group position={position}>
      {/* 1. THE MAIN POST */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 7, 8]} />
        <meshStandardMaterial color={lampColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 2. THE ARM (Hanging Logic Fixed) */}
      <mesh position={[side * -0.6, 7, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.08]} />
        <meshStandardMaterial color={lampColor} />
      </mesh>

      {/* 3. THE LANTERN UNIT */}
      <group position={[lanternX, 6.4, 0]}>
        {/* THE GLASS: Now using Standard Material for realistic building-like shading */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.15, 0.8, 4]} />
          <meshStandardMaterial
            color={lightColor}
            emissive={lightColor}
            emissiveIntensity={4} // Lower than before to let the shading show
            roughness={0.1}
            metalness={0}
          />
        </mesh>

        {/* THE METAL CORNER RIBS: Placed accurately to prevent "shredding" */}
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2 + Math.PI / 4, 0]}>
            <mesh position={[0.22, 0, 0]}>
              <boxGeometry args={[0.05, 0.82, 0.05]} />
              <meshStandardMaterial color={lampColor} />
            </mesh>
          </group>
        ))}

        {/* THE TOP CAP (The "Hat") */}
        <mesh position={[0, 0.45, 0]}>
          <coneGeometry args={[0.4, 0.25, 4]} />
          <meshStandardMaterial color={lampColor} />
        </mesh>

        {/* THE BOTTOM BASE (The "Socket") */}
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[0.2, 0.08, 0.2]} />
          <meshStandardMaterial color={lampColor} />
        </mesh>

        {/* 4. LIGHTING: One PointLight for the glow, one SpotLight for the wall shading */}
        <pointLight intensity={80} distance={15} color={lightColor} decay={2} />
      </group>

      {/* 5. GROUND LIGHT GRADIENT */}
      <mesh position={[lanternX, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshBasicMaterial color={lightColor} transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─── Ground System ─── */
function GroundSystem({ roadMap, sidewalkMap }: { roadMap: THREE.Texture; sidewalkMap: THREE.Texture }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -100]} receiveShadow>
        <planeGeometry args={[10, 260]} />
        <meshStandardMaterial map={roadMap} roughness={0.85} metalness={0} color="#BBBBBB" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, 0.12, -100]}>
        <planeGeometry args={[4, 260]} />
        <meshStandardMaterial map={sidewalkMap} roughness={0.85} metalness={0} color="#CCCCCC" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, 0.12, -100]}>
        <planeGeometry args={[4, 260]} />
        <meshStandardMaterial map={sidewalkMap} roughness={0.85} metalness={0} color="#CCCCCC" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -100]}>
        <planeGeometry args={[10, 260]} />
        <meshStandardMaterial color="#050508" transparent opacity={0.55} roughness={0} metalness={1} envMapIntensity={2} />
      </mesh>
      <mesh position={[-5, 0.06, -100]}>
        <boxGeometry args={[0.3, 0.12, 260]} />
        <meshStandardMaterial color="#444444" roughness={0.95} />
      </mesh>
      <mesh position={[5, 0.06, -100]}>
        <boxGeometry args={[0.3, 0.12, 260]} />
        <meshStandardMaterial color="#444444" roughness={0.95} />
      </mesh>
    </>
  );
}

/* ─── Road Markings ─── */
function RoadMarkings() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 65;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!ref.current) return;
    let idx = 0;
    for (let z = 30; z > -230 && idx < count; z -= 4) {
      dummy.position.set(0, 0.03, z);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      ref.current.setMatrixAt(idx++, dummy.matrix);
    }
    ref.current.count = idx;
    ref.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.15, 2]} />
      <meshBasicMaterial color={MATRIX_GREEN} transparent opacity={0.4} depthWrite={false} />
    </instancedMesh>
  );
}

/* ─── SVG Icon Helpers for Drone Hover ─── */
const GithubSVG = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
const InstagramSVG = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const EmailSVG = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

/* ─── Social Drone (DJI-style Quadcopter) ─── */
interface SocialDroneProps {
  center: [number, number, number];
  color: string;
  orbitRadiusX: number;
  orbitRadiusZ: number;
  speed: number;
  platform: string;
  label: string;
  link: string;
  IconComponent: React.FC;
}

function SocialDrone({ center, color, orbitRadiusX, orbitRadiusZ, speed, platform, label, link, IconComponent }: SocialDroneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const rotorRefs = useRef<THREE.Mesh[]>([]);
  const navLeftRef = useRef<THREE.Mesh>(null);
  const navRightRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const offsetRef = useRef(Math.random() * Math.PI * 2);

  // 4 arm angles for X-frame quadcopter (45°, 135°, 225°, 315°)
  const armAngles = useMemo(() => [45, 135, 225, 315].map(d => (d * Math.PI) / 180), []);
  const armLength = 1.05;

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation(); setHovered(true); hoveredRef.current = true; document.body.style.cursor = 'pointer';
  }, []);
  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation(); setHovered(false); hoveredRef.current = false; document.body.style.cursor = 'none';
  }, []);
  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    window.open(link, '_blank', 'noopener,noreferrer');
  }, [link]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const s = hoveredRef.current ? speed * 0.2 : speed;
    const elapsed = t * s + offsetRef.current;
    groupRef.current.position.x = center[0] + Math.sin(elapsed) * orbitRadiusX;
    groupRef.current.position.z = center[2] + Math.cos(elapsed * 0.6) * orbitRadiusZ;
    groupRef.current.position.y = Math.max(5, 8 + Math.sin(t * 1.3) * 1.5);
    groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -5, 5);

    // Body yaw tracks orbit direction; tilt follows lateral/forward motion
    // Html panel is OUTSIDE bodyRef so it stays screen-space and never inverts
    if (bodyRef.current) {
      // Yaw: face direction of travel along elliptical orbit
      const vx = Math.cos(elapsed) * orbitRadiusX * s;
      const vz = -Math.sin(elapsed * 0.6) * orbitRadiusZ * s * 0.6;
      bodyRef.current.rotation.y = Math.atan2(vx, vz);
      // Roll/pitch with motion
      bodyRef.current.rotation.z = Math.sin(elapsed) * 0.10;
      bodyRef.current.rotation.x = Math.cos(elapsed * 0.6) * 0.07;
    }

    const rotorSpeed = hoveredRef.current ? 0.55 : 0.38;
    rotorRefs.current.forEach(r => { if (r) r.rotation.y += rotorSpeed; });

    // Nav light pulse
    const pulse = 3 + Math.sin(t * 2) * 5;
    if (navLeftRef.current) (navLeftRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = Math.max(0, pulse);
    if (navRightRef.current) (navRightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = Math.max(0, pulse);
  });

  return (
    <group ref={groupRef} position={[center[0], 8, center[2]]}>
      {/* INVISIBLE CLICK HITBOX */}
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        renderOrder={999}
      >
        <sphereGeometry args={[2.0, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.0001} depthWrite={false} depthTest={false} side={THREE.FrontSide} />
      </mesh>

      {/* ── DJI-style body group (tilts with motion) ── */}
      <group ref={bodyRef}>

        {/* Main body — elongated boxy fuselage */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.72, 0.22, 1.0]} />
          <meshStandardMaterial color="#0C0C18" metalness={0.92} roughness={0.08} emissive={color} emissiveIntensity={0.12} />
        </mesh>

        {/* Top shell (slightly narrower, rounded feel) */}
        <mesh position={[0, 0.12, -0.05]}>
          <boxGeometry args={[0.6, 0.08, 0.82]} />
          <meshStandardMaterial color="#141426" metalness={0.88} roughness={0.12} />
        </mesh>

        {/* Front sensor bar (DJI obstacle avoidance sensors) */}
        <mesh position={[0, 0, 0.52]}>
          <boxGeometry args={[0.58, 0.14, 0.04]} />
          <meshStandardMaterial color="#050510" metalness={1} roughness={0} emissive={color} emissiveIntensity={0.6} />
        </mesh>

        {/* Status LED strip on top */}
        <mesh position={[0, 0.165, 0]}>
          <boxGeometry args={[0.08, 0.02, 0.5]} />
          <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={4} />
        </mesh>

        {/* 4 Arms (X-frame diagonal) */}
        {armAngles.map((angle, i) => {
          const tipX = Math.cos(angle) * armLength;
          const tipZ = Math.sin(angle) * armLength;
          const midX = Math.cos(angle) * armLength * 0.5;
          const midZ = Math.sin(angle) * armLength * 0.5;
          const armRotY = -angle + Math.PI / 2;
          return (
            <group key={`arm${i}`}>
              {/* Arm tube */}
              <mesh position={[midX, 0, midZ]} rotation={[0, armRotY, Math.PI / 2]}>
                <cylinderGeometry args={[0.028, 0.04, armLength, 6]} />
                <meshStandardMaterial color="#080814" metalness={0.95} roughness={0.1} />
              </mesh>
              {/* Motor housing */}
              <mesh position={[tipX, 0.04, tipZ]}>
                <cylinderGeometry args={[0.1, 0.08, 0.1, 12]} />
                <meshStandardMaterial color="#0A0A18" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.5} />
              </mesh>
              {/* Spinning prop disc (2-blade visible blur) */}
              <group position={[tipX, 0.1, tipZ]}>
                <mesh ref={(el) => { if (el) rotorRefs.current[i] = el; }}>
                  {/* Two blades as a thin crossed box */}
                  <boxGeometry args={[0.55, 0.015, 0.06]} />
                  <meshStandardMaterial color="#111122" metalness={0.7} roughness={0.3} />
                </mesh>
                {/* Second blade perpendicular */}
                <mesh rotation={[0, Math.PI / 2, 0]} ref={(el) => { if (el) rotorRefs.current[i + 4] = el; }}>
                  <boxGeometry args={[0.55, 0.015, 0.06]} />
                  <meshStandardMaterial color="#111122" metalness={0.7} roughness={0.3} />
                </mesh>
                {/* Motion blur disc */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.28, 0.28, 0.004, 16]} />
                  <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
                </mesh>
              </group>
              {/* Landing leg (extends below motor) */}
              <mesh position={[tipX * 0.82, -0.32, tipZ * 0.82]} rotation={[Math.cos(angle) * 0.3, 0, -Math.sin(angle) * 0.3]}>
                <cylinderGeometry args={[0.018, 0.014, 0.55, 6]} />
                <meshStandardMaterial color="#0A0A18" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          );
        })}

        {/* Landing gear foot cross-bar (front) */}
        <mesh position={[0, -0.55, 0.6]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.55, 6]} />
          <meshStandardMaterial color="#0A0A18" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Landing gear foot cross-bar (rear) */}
        <mesh position={[0, -0.55, -0.6]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.55, 6]} />
          <meshStandardMaterial color="#0A0A18" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Camera gimbal mount (below front of body) */}
        <group position={[0, -0.2, 0.36]}>
          {/* Gimbal arm */}
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[0.14, 0.12, 0.08]} />
            <meshStandardMaterial color="#080810" metalness={0.95} roughness={0.05} />
          </mesh>
          {/* Camera ball */}
          <mesh position={[0, -0.18, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#050510" metalness={1.0} roughness={0.0} emissive={color} emissiveIntensity={1.2} />
          </mesh>
          {/* Lens */}
          <mesh position={[0, -0.18, 0.1]}>
            <cylinderGeometry args={[0.05, 0.06, 0.04, 12]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#000" metalness={0.5} roughness={0} emissive="#4466FF" emissiveIntensity={1.5} />
          </mesh>
        </group>

        {/* Navigation lights */}
        <mesh ref={navLeftRef} position={[-0.38, 0, 0.42]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#000" emissive="#FF2222" emissiveIntensity={8} />
        </mesh>
        <mesh ref={navRightRef} position={[0.38, 0, 0.42]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#000" emissive="#22FF44" emissiveIntensity={8} />
        </mesh>

        {/* Rear status light */}
        <mesh position={[0, 0, -0.52]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={6} />
        </mesh>

        {/* Downlight beam cone */}
        <mesh position={[0, -1.5, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.7, 2.8, 8, 1, true]} />
          <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>

      </group>{/* end body group */}

      {/* Drone point light */}
      <pointLight position={[0, -0.5, 0]} color={color} intensity={hovered ? 8 : 4} distance={6} decay={2} />

      {/* Hologram panel — always visible, screen-space aligned (no transform to prevent inversion) */}
      <Html
        position={[0, 3.2, 0]}
        occlude={false}
        distanceFactor={10}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          width: '260px', padding: '18px 20px',
          background: hovered ? 'rgba(8,8,20,0.97)' : 'rgba(8,8,20,0.75)',
          border: `1px solid ${hovered ? color : color + '88'}`,
          boxShadow: hovered ? `0 0 28px ${color}44` : `0 0 12px ${color}22`,
          fontFamily: "'Inter', sans-serif",
          color: '#F0F0F5',
          textAlign: 'center',
          borderRadius: '4px',
          transition: 'all 300ms ease',
          opacity: hovered ? 1 : 0.78,
        }}>
          {/* Hologram scan line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            borderRadius: '4px 4px 0 0',
          }} />
          <div style={{ color: hovered ? color : color + 'CC', marginBottom: '10px', transform: 'scale(0.75)', transformOrigin: 'center' }}>
            <IconComponent />
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontSize: '13px',
            fontWeight: 700, color: '#F0F0F5',
            letterSpacing: '0.18em', marginBottom: '6px',
          }}>{platform.toUpperCase()}</div>
          <div style={{
            width: '50%', height: '1px',
            background: `rgba(255,255,255,0.08)`,
            margin: '0 auto 8px',
          }} />
          <div style={{
            fontSize: '10px', color: '#8888AA',
            letterSpacing: '0.1em', marginBottom: hovered ? '14px' : '0',
          }}>{label}</div>
          {hovered && (
            <button
              onPointerDown={(e) => { e.stopPropagation(); window.open(link, '_blank', 'noopener,noreferrer'); }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = color; (e.target as HTMLElement).style.color = '#050510'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = color; }}
              style={{
                pointerEvents: 'auto',
                fontFamily: "'Syne', sans-serif",
                fontSize: '11px', letterSpacing: '0.15em',
                border: `1px solid ${color}`,
                color,
                background: 'transparent',
                padding: '7px 18px',
                cursor: 'pointer',
                transition: 'all 200ms',
                marginTop: '4px',
              }}
            >OPEN →</button>
          )}
        </div>
      </Html>
    </group>
  );
}

/* ─── End-of-Street Building (Contact District) ─── */
function EndOfStreetBuilding({ brickMap }: { brickMap: THREE.Texture }) {
  const windowData = useMemo(() => {
    const wins: { x: number; y: number; on: boolean }[] = [];
    const cols = [-12, -7.2, -2.4, 2.4, 7.2, 12];
    const rows = [4, 8, 12, 16, 20];
    for (const y of rows) {
      for (const x of cols) {
        wins.push({ x, y, on: Math.random() > 0.3 });
      }
    }
    return wins;
  }, []);

  return (
    <group position={[0, 0, -215]}>
      {/* Building body */}
      <mesh position={[0, 15, 0]}>
        <boxGeometry args={[32, 30, 8]} />
        <meshStandardMaterial map={brickMap} color="#CCCCCC" roughness={0.88} metalness={0} />
      </mesh>
      {/* Rooftop cap */}
      <mesh position={[0, 30.25, 0]}>
        <boxGeometry args={[33, 0.5, 9]} />
        <meshStandardMaterial color="#111118" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Windows */}
      {windowData.map((win, i) => (
        <mesh key={`w${i}`} position={[win.x, win.y, 4.01]}>
          <planeGeometry args={[1.2, 1.6]} />
          <meshStandardMaterial color="#000" emissive={win.on ? '#AAFF88' : '#000000'} emissiveIntensity={win.on ? 1.0 : 0} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Fire escapes */}
      {[[-8, 8], [-2, 14], [4, 20], [10, 26]].map(([x, y], i) => (
        <mesh key={`fe${i}`} position={[x, y, 4.1]}>
          <boxGeometry args={[3, 0.15, 0.3]} />
          <meshStandardMaterial color="#2A2A3A" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {/* Mural panel — enlarged */}
      <mesh position={[0, 15, 4.05]}>
        <planeGeometry args={[22, 26]} />
        <meshStandardMaterial color="#0A0A14" emissive={ACCENT_VIOLET} emissiveIntensity={0.1} roughness={0.2} metalness={0.4} />
      </mesh>
      {/* Inner glow layer */}
      <mesh position={[0, 15, 4.06]}>
        <planeGeometry args={[20, 24]} />
        <meshBasicMaterial color={ACCENT_VIOLET} transparent opacity={0.03} depthWrite={false} />
      </mesh>
      {/* Mural frame — top/bottom/left/right */}
      <mesh position={[0, 28.06, 4.08]}><boxGeometry args={[22.3, 0.14, 0.07]} /><meshStandardMaterial color="#000" emissive={ACCENT_VIOLET} emissiveIntensity={4} /></mesh>
      <mesh position={[0, 1.94, 4.08]}><boxGeometry args={[22.3, 0.14, 0.07]} /><meshStandardMaterial color="#000" emissive={ACCENT_VIOLET} emissiveIntensity={4} /></mesh>
      <mesh position={[-11.06, 15, 4.08]}><boxGeometry args={[0.14, 26.3, 0.07]} /><meshStandardMaterial color="#000" emissive={ACCENT_VIOLET} emissiveIntensity={4} /></mesh>
      <mesh position={[11.06, 15, 4.08]}><boxGeometry args={[0.14, 26.3, 0.07]} /><meshStandardMaterial color="#000" emissive={ACCENT_VIOLET} emissiveIntensity={4} /></mesh>
      {/* Corner accent dots */}
      {[[-11, 28], [11, 28], [-11, 2], [11, 2]].map(([cx, cy], i) => (
        <mesh key={`corner${i}`} position={[cx, cy, 4.1]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#000" emissive={ACCENT_VIOLET} emissiveIntensity={6} />
        </mesh>
      ))}
      {/* Mural Html - identity panel — bigger */}
      <Html position={[0, 15, 4.12]} transform occlude={false} distanceFactor={28} style={{ pointerEvents: 'none' }}>
        <div style={{ width: '360px', height: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
          {/* Outer ring */}
          <div style={{ position: 'relative', width: '180px', height: '180px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid #6E6EFF33', animation: 'none' }} />
            <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', border: '2px solid #6E6EFF', background: 'radial-gradient(circle, #0F0F1A 60%, #0A0A2A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontSize: '52px', fontWeight: 700, color: '#6E6EFF' }}>VL</div>
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, color: '#F0F0F5', letterSpacing: '0.2em', textAlign: 'center' }}>VITTORIA LANZO</div>
          <div style={{ width: '120px', height: '1px', background: 'linear-gradient(90deg, transparent, #6E6EFF, transparent)' }} />
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#8888AA', letterSpacing: '0.15em', textAlign: 'center' }}>AI PROMPT ENGINEER</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#44445A', letterSpacing: '0.1em', textAlign: 'center' }}>AGENTIC SYSTEMS DESIGNER</div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
            {['◈', '⬡', '◎'].map((icon, i) => (
              <div key={i} style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', color: '#6E6EFF', opacity: 0.6 }}>{icon}</div>
            ))}
          </div>
        </div>
      </Html>
      {/* Neon front strip */}
      <mesh position={[0, 30.4, 4.0]}>
        <boxGeometry args={[32, 0.4, 0.2]} />
        <meshStandardMaterial color="#000" emissive={MATRIX_GREEN} emissiveIntensity={5} />
      </mesh>
      <pointLight position={[0, 30.4, 4.0]} color={MATRIX_GREEN} intensity={4} distance={12} decay={2} />

      {/* ══════════════════════════════
          ROOFTOP — visible when camera rises above y=30
          ══════════════════════════════ */}

      {/* Rooftop deck surface */}
      <mesh position={[0, 30.6, 0]}>
        <boxGeometry args={[32, 0.18, 8]} />
        <meshStandardMaterial color="#181822" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Rooftop perimeter parapet */}
      {/* Front */}
      <mesh position={[0, 31.3, 4.1]}>
        <boxGeometry args={[32.2, 1.4, 0.22]} />
        <meshStandardMaterial color="#1A1A28" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 31.3, -4.1]}>
        <boxGeometry args={[32.2, 1.4, 0.22]} />
        <meshStandardMaterial color="#1A1A28" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Left */}
      <mesh position={[-16.1, 31.3, 0]}>
        <boxGeometry args={[0.22, 1.4, 8.4]} />
        <meshStandardMaterial color="#1A1A28" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Right */}
      <mesh position={[16.1, 31.3, 0]}>
        <boxGeometry args={[0.22, 1.4, 8.4]} />
        <meshStandardMaterial color="#1A1A28" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Parapet neon edge strip */}
      <mesh position={[0, 32.05, 4.2]}>
        <boxGeometry args={[32.4, 0.06, 0.08]} />
        <meshStandardMaterial color="#000" emissive={ACCENT_VIOLET} emissiveIntensity={5} />
      </mesh>
      <mesh position={[-16.2, 32.05, 0]}>
        <boxGeometry args={[0.08, 0.06, 8.6]} />
        <meshStandardMaterial color="#000" emissive={ACCENT_VIOLET} emissiveIntensity={5} />
      </mesh>
      <mesh position={[16.2, 32.05, 0]}>
        <boxGeometry args={[0.08, 0.06, 8.6]} />
        <meshStandardMaterial color="#000" emissive={ACCENT_VIOLET} emissiveIntensity={5} />
      </mesh>

      {/* Central rooftop VL logo — visible from above */}
      <mesh position={[0, 30.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#0A0A14" emissive={ACCENT_VIOLET} emissiveIntensity={0.6} />
      </mesh>
      {/* Html wrapped in rotated group so it lies flat on the roof facing upward */}
      <group position={[0, 30.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Html transform occlude={false} distanceFactor={30} style={{ pointerEvents: 'none' }}>
          <div style={{ width: '200px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 700, color: '#6E6EFF', textShadow: '0 0 20px #6E6EFF' }}>VL</div>
            <div style={{ width: '1px', height: '40px', background: '#6E6EFF44' }} />
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', color: '#6E6EFF88', letterSpacing: '0.2em', textTransform: 'uppercase', lineHeight: 1.6 }}>VITTORIA<br/>LANZO</div>
          </div>
        </Html>
      </group>

      {/* Water tower cluster (left) */}
      <group position={[-10, 30.7, -1.5]}>
        {[[-0.5,0,-0.5],[0.5,0,-0.5],[-0.5,0,0.5],[0.5,0,0.5]].map(([lx,,lz], li) => (
          <mesh key={`rtleg${li}`} position={[lx, 1.0, lz]}>
            <boxGeometry args={[0.07, 2.0, 0.07]} />
            <meshStandardMaterial color="#1A1810" metalness={0.3} roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 2.8, 0]}><cylinderGeometry args={[0.65, 0.85, 2, 8]} /><meshStandardMaterial color="#1A1810" metalness={0.3} roughness={0.9} /></mesh>
        <mesh position={[0, 4.0, 0]}><coneGeometry args={[0.75, 0.9, 8]} /><meshStandardMaterial color="#1A1810" metalness={0.3} roughness={0.9} /></mesh>
      </group>

      {/* HVAC units (right cluster) */}
      {[[6, 30.8, 1], [9, 30.8, -1.5], [12, 30.8, 1.5]].map(([hx, hy, hz], hi) => (
        <group key={`hvac${hi}`} position={[hx, hy, hz]}>
          <mesh><boxGeometry args={[1.6, 0.9, 1.0]} /><meshStandardMaterial color="#181820" metalness={0.7} roughness={0.5} /></mesh>
          <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25, 0.04, 6, 12]} />
            <meshStandardMaterial color="#000" emissive="#004400" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}

      {/* Tall antenna array (centre-right) */}
      <group position={[5, 30.7, -2]}>
        <mesh><cylinderGeometry args={[0.04, 0.06, 5, 6]} /><meshStandardMaterial color="#111118" metalness={0.9} roughness={0.2} /></mesh>
        <mesh position={[0, 2.6, 0]}><sphereGeometry args={[0.09, 8, 8]} /><meshStandardMaterial color="#000" emissive="#FF2222" emissiveIntensity={5} /></mesh>
        <mesh position={[-0.6, 1.5, 0]}><boxGeometry args={[1.2, 0.04, 0.04]} /><meshStandardMaterial color="#111118" metalness={0.9} roughness={0.2} /></mesh>
        <mesh position={[0, 2.2, 0]} rotation={[0, Math.PI / 3, 0]}><boxGeometry args={[0.8, 0.04, 0.04]} /><meshStandardMaterial color="#111118" metalness={0.9} roughness={0.2} /></mesh>
      </group>

      {/* Rooftop ambient light pointing down */}
      <pointLight position={[0, 34, 0]} color={ACCENT_VIOLET} intensity={3} distance={20} decay={2} />
      <pointLight position={[-10, 33, 0]} color={MATRIX_GREEN} intensity={1.5} distance={15} decay={2} />

      {/* Spotlights on front mural */}
      <spotLight position={[-4, 22, 6]} color={ACCENT_VIOLET} intensity={6} angle={0.4} penumbra={0.7} target-position={[0, 12, 4]} />
      <spotLight position={[4, 22, 6]} color={ACCENT_VIOLET} intensity={6} angle={0.4} penumbra={0.7} />
    </group>
  );
}

/* ─── Rain (green-tinted) ─── */
function RainParticles({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 260;
      vel[i] = 0.3 + Math.random() * 0.5;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const posArray = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] -= velocities[i];
      if (posArray[i * 3 + 1] < -5) {
        posArray[i * 3 + 1] = 50 + Math.random() * 10;
        posArray[i * 3] = (Math.random() - 0.5) * 80;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#88FFaa" size={0.08} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

/* ─── Floating Dust ─── */
function FloatingDust() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 200;
  const speeds = useMemo(() => Array.from({ length: count }, () => 0.005 + Math.random() * 0.015), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set((Math.random() - 0.5) * 60, Math.random() * 20, (Math.random() - 0.5) * 260);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  const _mat = useMemo(() => new THREE.Matrix4(), []);
  const _pos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      ref.current.getMatrixAt(i, _mat);
      _pos.setFromMatrixPosition(_mat);
      _pos.y += speeds[i];
      if (_pos.y > 25) _pos.y = 0;
      _mat.setPosition(_pos);
      ref.current.setMatrixAt(i, _mat);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshBasicMaterial color="#22AA44" toneMapped={false} />
    </instancedMesh>
  );
}

/* ─── Camera Controller ─── */
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    const t = scrollProgress;
    let z: number, y: number;

    if (t <= 0.80) {
      z = THREE.MathUtils.lerp(30, -155, t / 0.80);
      y = 3;
      camera.position.set(0, y, z);
      camera.lookAt(0, 3, z - 20);
    } else {
      const sub = (t - 0.80) / 0.20;
      if (sub < 0.5) {
        // Phase 1: approach the building
        const s = sub * 2;
        z = THREE.MathUtils.lerp(-155, -200, s);
        y = THREE.MathUtils.lerp(3, 12, s);
        camera.position.set(0, y, z);
        camera.lookAt(0, 15, -215);
      } else {
        // Phase 2: rise above the rooftop (y=30.25)
        const s = (sub - 0.5) * 2;
        z = THREE.MathUtils.lerp(-200, -195, s);
        y = THREE.MathUtils.lerp(12, 38, s);
        camera.position.set(0, y, z);
        camera.lookAt(0, THREE.MathUtils.lerp(15, 32, s), -215);
      }
    }
  });
  return null;
}

/* ─── Fog setter ─── */
function MatrixFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#080810', 0.005);
    scene.background = new THREE.Color('#08080F');
    return () => { scene.fog = null; };
  }, [scene]);
  return null;
}

/* ─── City Glow Dome ─── */
function CityGlowDome() {
  return (
    <mesh>
      <sphereGeometry args={[180, 16, 16]} />
      <meshBasicMaterial color="#0A0A14" transparent opacity={0.4} side={THREE.BackSide} />
    </mesh>
  );
}

/* ─── Neon Halo Sprite ─── */
function NeonHalo({ position, color, scale = 4 }: { position: [number, number, number]; color: string; scale?: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.15)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial map={texture} color={color} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

/* ─── Floating Stall Arrow (bobs up/down above each stall) ─── */
function StallArrow({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = 5.8 + Math.sin(clock.getElapsedTime() * 2.2) * 0.22;
  });
  return (
    <group ref={ref} position={[0, 5.8, 0]}>
      {/* Outer ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.028, 8, 20]} />
        <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={4} />
      </mesh>
      {/* Inner ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]}>
        <torusGeometry args={[0.22, 0.018, 8, 16]} />
        <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={3} />
      </mesh>
      {/* Downward pointing cone */}
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.14, 0.38, 8]} />
        <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={6} />
      </mesh>
      {/* Stem connecting to stall top */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.6, 6]} />
        <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={2} />
      </mesh>
      <pointLight color={color} intensity={2} distance={5} decay={2} />
    </group>
  );
}

/* ─── Navigation Stalls ─── */
const STALL_DESCRIPTIONS: Record<string, string> = {
  about:   'Who I am & what I build',
  skills:  'Tech stack & core practice',
  work:    'Featured AI projects',
  lab:     'Experiments & concepts',
  contact: 'Start a conversation',
};

function NavigationStalls({ onStallClick }: { onStallClick: (id: string) => void }) {
  const stalls = useMemo(() => [
    { id: 'about',   label: 'ABOUT',    z: -20,  side: -1, color: '#6E6EFF' },
    { id: 'skills',  label: 'EXPERTISE',z: -55,  side:  1, color: '#00FF88' },
    { id: 'work',    label: 'WORK',     z: -90,  side: -1, color: '#00D4FF' },
    { id: 'lab',     label: 'LAB',      z: -125, side:  1, color: '#FF2D78' },
    { id: 'contact', label: 'CONTACT',  z: -160, side: -1, color: '#6E6EFF' },
  ], []);

  // S = scale factor: 1.75× the original stall dimensions
  const S = 1.75;

  return (
    <>
      {stalls.map((stall) => (
        <group key={stall.id} position={[stall.side * 9.5, 0, stall.z]}>

          {/* ── Base plinth ── */}
          <mesh position={[0, 0.075 * S, 0]}>
            <boxGeometry args={[1.8 * S, 0.15 * S, 0.8 * S]} />
            <meshStandardMaterial color="#1A1A28" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* ── Step/accent strip at bottom ── */}
          <mesh position={[0, 0.18 * S, 0]}>
            <boxGeometry args={[1.9 * S, 0.04, 0.82 * S]} />
            <meshStandardMaterial color="#000" emissive={stall.color} emissiveIntensity={2.5} />
          </mesh>

          {/* ── Main screen body ── */}
          <mesh position={[0, 1.225 * S, 0]}>
            <boxGeometry args={[1.6 * S, 2.0 * S, 0.14 * S]} />
            <meshStandardMaterial color="#070712" emissive={stall.color} emissiveIntensity={0.18} metalness={0.9} roughness={0.05} />
          </mesh>

          {/* ── Screen glass (road-facing) ── */}
          <mesh position={[0, 1.225 * S, 0.08 * S]}>
            <planeGeometry args={[1.42 * S, 1.82 * S]} />
            <meshStandardMaterial color="#000010" emissive={stall.color} emissiveIntensity={0.12} transparent opacity={0.88} side={THREE.DoubleSide} />
          </mesh>

          {/* ── Top cap (glowing) ── */}
          <mesh position={[0, 2.28 * S, 0]}>
            <boxGeometry args={[1.7 * S, 0.1 * S, 0.2 * S]} />
            <meshStandardMaterial color="#000" emissive={stall.color} emissiveIntensity={6.0} />
          </mesh>

          {/* ── Side pillars ── */}
          <mesh position={[-0.84 * S, 1.15 * S, 0]}>
            <boxGeometry args={[0.09 * S, 2.2 * S, 0.16 * S]} />
            <meshStandardMaterial color="#000" emissive={stall.color} emissiveIntensity={3.5} />
          </mesh>
          <mesh position={[0.84 * S, 1.15 * S, 0]}>
            <boxGeometry args={[0.09 * S, 2.2 * S, 0.16 * S]} />
            <meshStandardMaterial color="#000" emissive={stall.color} emissiveIntensity={3.5} />
          </mesh>

          {/* ── Floor glow ring ── */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.4 * S, 32]} />
            <meshBasicMaterial color={stall.color} transparent opacity={0.08} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.1 * S, 0.04, 8, 32]} />
            <meshStandardMaterial color="#000" emissive={stall.color} emissiveIntensity={3} transparent opacity={0.8} />
          </mesh>

          {/* ── HTML label overlay ── */}
          <Html
            distanceFactor={10}
            transform
            occlude={false}
            position={[0, 1.225 * S, 0.1 * S]}
            style={{ pointerEvents: 'none' }}
          >
            <div style={{
              width: '180px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '7px',
              pointerEvents: 'none',
            }}>
              {/* Section number */}
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: '9px',
                color: stall.color, opacity: 0.5, letterSpacing: '0.2em',
              }}>
                {String(stalls.findIndex(s => s.id === stall.id) + 1).padStart(2, '0')}
              </div>
              {/* Label */}
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 700,
                color: stall.color, letterSpacing: '0.3em', textAlign: 'center',
                textShadow: `0 0 16px ${stall.color}`,
              }}>{stall.label}</div>
              {/* Divider */}
              <div style={{ width: '50px', height: '1px', background: stall.color, opacity: 0.4 }} />
              {/* Description */}
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: '9px',
                color: '#8888AA', letterSpacing: '0.08em', textAlign: 'center',
                lineHeight: 1.5,
              }}>{STALL_DESCRIPTIONS[stall.id]}</div>
              {/* CTA */}
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: '8px',
                color: stall.color, letterSpacing: '0.2em', textAlign: 'center',
                marginTop: '2px', opacity: 0.7,
              }}>TAP TO OPEN →</div>
            </div>
          </Html>

          {/* ── Click hitbox ── */}
          <mesh
            position={[0, 1.3 * S, 0]}
            onClick={(e) => { e.stopPropagation(); onStallClick(stall.id); }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'none'; }}
          >
            <boxGeometry args={[2.6 * S, 3.2 * S, 0.9 * S]} />
            <meshBasicMaterial transparent opacity={0.0001} depthWrite={false} />
          </mesh>

          {/* ── Point lights ── */}
          <pointLight position={[0, 1.8 * S, 0.6]} color={stall.color} intensity={4} distance={10} decay={2} />
          <pointLight position={[0, 0.2, 0]} color={stall.color} intensity={1.5} distance={5} decay={2} />

          {/* ── Floating arrow above stall ── */}
          <StallArrow color={stall.color} />
        </group>
      ))}
    </>
  );
}

/* ─── Street Props ─── */
function StreetProps({ isMobile }: { isMobile: boolean }) {
  const props = useMemo(() => {
    const trashCans: { pos: [number, number, number]; tipped: boolean }[] = [];
    let trashSide = 1;
    for (let z = 20; z > -200; z -= 30) {
      trashCans.push({ pos: [trashSide * 6, 0.3, z], tipped: Math.random() < 0.2 });
      trashSide *= -1;
    }

    const cars: { pos: [number, number, number]; color: string; rotY: number; lightsOn: boolean }[] = [];
    const carColors = ['#1A3A1A', '#1A1A38', '#381A1A', '#2A2A2A'];
    const usedZ = new Set<number>();
    for (let i = 0; i < 10; i++) {
      let cz = 25 - Math.floor(Math.random() * 215);
      while (usedZ.has(cz)) cz -= 3;
      usedZ.add(cz);
      const cside = Math.random() > 0.5 ? 1 : -1;
      cars.push({
        pos: [cside * 7.5, 0, cz],
        color: carColors[Math.floor(Math.random() * carColors.length)],
        rotY: Math.random() > 0.5 ? 0 : Math.PI,
        lightsOn: Math.random() < 0.3,
      });
    }

    const manholes: [number, number, number][] = [];
    for (let i = 0; i < 5; i++) {
      const mx = (Math.random() - 0.5) * 6;
      manholes.push([mx, 0.01, -20 - i * 40]);
    }

    const puddles: { pos: [number, number, number]; sx: number; sz: number }[] = [];
    for (let i = 0; i < 5; i++) {
      puddles.push({
        pos: [(Math.random() > 0.5 ? 1 : -1) * (5.5 + Math.random() * 2), 0.01, -10 - i * 35],
        sx: 1.0 + Math.random() * 0.8,
        sz: 0.5 + Math.random() * 0.4,
      });
    }

    const debris: { pos: [number, number, number]; ry: number }[] = [];
    for (let i = 0; i < 12; i++) {
      debris.push({
        pos: [(Math.random() > 0.5 ? 1 : -1) * (5.5 + Math.random() * 3), 0.003, -5 - Math.random() * 200],
        ry: Math.random() * Math.PI * 2,
      });
    }

    const vendorStalls: { pos: [number, number, number]; color: string }[] = [];
    if (!isMobile) {
      const stallColors = ['#1A2A1A', '#2A1A1A', '#1A1A2A'];
      for (let i = 0; i < 3; i++) {
        const vs = Math.random() > 0.5 ? 1 : -1;
        vendorStalls.push({
          pos: [vs * 6.5, 0, -30 - i * 55],
          color: stallColors[i % stallColors.length],
        });
      }
    }

    return { trashCans, cars, manholes, puddles, debris, vendorStalls };
  }, [isMobile]);

  let streetLightCount = 0;

  return (
    <>
      {/* Trash cans */}
      {props.trashCans.map((tc, i) => (
        <group key={`tc${i}`} position={tc.pos} rotation={tc.tipped ? [0, 0, Math.PI / 2] : [0, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.2, 0.6, 8]} />
            <meshStandardMaterial color="#3A3848" metalness={0.4} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.05, 8]} />
            <meshStandardMaterial color="#2A2A30" metalness={0.5} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Parked cars */}
      {props.cars.map((car, i) => (
        <group key={`car${i}`} position={car.pos} rotation={[0, car.rotY, 0]}>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[2.2, 0.7, 1.0]} />
            <meshStandardMaterial color={car.color} metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <boxGeometry args={[1.4, 0.45, 0.95]} />
            <meshStandardMaterial color={car.color} metalness={0.4} roughness={0.5} />
          </mesh>
          {[[-0.75, 0.22, 0.45], [0.75, 0.22, 0.45], [-0.75, 0.22, -0.45], [0.75, 0.22, -0.45]].map(([wx, wy, wz], wi) => (
            <mesh key={`wh${wi}`} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.15, 12]} />
              <meshStandardMaterial color="#222222" metalness={0.3} roughness={0.9} />
            </mesh>
          ))}
          {car.lightsOn && (
            <>
              <mesh position={[1.1, 0.55, 0.3]}><planeGeometry args={[0.1, 0.1]} /><meshStandardMaterial color="#000" emissive="#FFFFAA" emissiveIntensity={1.5} side={THREE.DoubleSide} /></mesh>
              <mesh position={[1.1, 0.55, -0.3]}><planeGeometry args={[0.1, 0.1]} /><meshStandardMaterial color="#000" emissive="#FFFFAA" emissiveIntensity={1.5} side={THREE.DoubleSide} /></mesh>
              <mesh position={[-1.1, 0.55, 0.3]}><planeGeometry args={[0.1, 0.1]} /><meshStandardMaterial color="#000" emissive="#FF2222" emissiveIntensity={1.5} side={THREE.DoubleSide} /></mesh>
              <mesh position={[-1.1, 0.55, -0.3]}><planeGeometry args={[0.1, 0.1]} /><meshStandardMaterial color="#000" emissive="#FF2222" emissiveIntensity={1.5} side={THREE.DoubleSide} /></mesh>
            </>
          )}
        </group>
      ))}

      {/* Manholes — first one is clickable (privacy policy) */}
      {props.manholes.map((mh, i) => (
        <group key={`mh${i}`}>
          <mesh
            position={mh}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={i === 0 ? (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); window.location.href = '/privacy'; } : undefined}
            onPointerOver={i === 0 ? () => { document.body.style.cursor = 'pointer'; } : undefined}
            onPointerOut={i === 0 ? () => { document.body.style.cursor = ''; } : undefined}
          >
            <circleGeometry args={[0.5, 24]} />
            <meshStandardMaterial color={i === 0 ? '#2A2A40' : '#333330'} metalness={0.8} roughness={0.9} />
          </mesh>
          <mesh position={[mh[0], 0.02, mh[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.52, 0.03, 8, 24]} />
            <meshStandardMaterial color="#000" emissive={i === 0 ? '#6E6EFF' : '#003300'} emissiveIntensity={i === 0 ? 4.0 : 3.0} />
          </mesh>
          {i === 0 && (
            /* No distanceFactor — fixed screen-size label always legible */
            <Html position={[mh[0], 0.22, mh[2]]} center style={{ pointerEvents: 'none' }}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '11px', fontWeight: 600,
                color: '#6E6EFF', letterSpacing: '0.25em',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                textShadow: '0 0 8px #6E6EFF',
                background: 'rgba(5,5,18,0.7)',
                padding: '2px 6px', borderRadius: '2px',
              }}>PRIVACY</div>
            </Html>
          )}
        </group>
      ))}

      {/* Puddles */}
      {props.puddles.map((p, i) => (
        <mesh key={`pud${i}`} position={p.pos} rotation={[-Math.PI / 2, 0, 0]} scale={[p.sx, p.sz, 1]}>
          <circleGeometry args={[1, 16]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}

      {/* Debris */}
      {props.debris.map((db, i) => (
        <mesh key={`db${i}`} position={db.pos} rotation={[0, db.ry, 0]}>
          <boxGeometry args={[0.25, 0.005, 0.18]} />
          <meshStandardMaterial color="#222228" metalness={0.2} roughness={0.9} />
        </mesh>
      ))}

      {/* Vendor stalls */}
      {props.vendorStalls.map((vs, i) => {
        const hasLight = streetLightCount < 2;
        if (hasLight) streetLightCount++;
        return (
          <group key={`vs${i}`} position={vs.pos}>
            {[[-0.8, 0, -0.5], [0.8, 0, -0.5], [0, 0, 0.5]].map(([px, , pz], pi) => (
              <mesh key={`vp${pi}`} position={[px, 1.1, pz]}>
                <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
                <meshStandardMaterial color="#282838" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
            <mesh position={[0, 2.2, 0]}>
              <boxGeometry args={[2.0, 0.05, 1.5]} />
              <meshStandardMaterial color={vs.color} emissive={vs.color} emissiveIntensity={0.3} transparent opacity={0.85} />
            </mesh>
            <mesh position={[0, 0.9, 0]}>
              <boxGeometry args={[1.8, 0.6, 0.5]} />
              <meshStandardMaterial color="#222232" metalness={0.5} roughness={0.6} />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <boxGeometry args={[1.0, 0.15, 0.05]} />
              <meshStandardMaterial color="#111111" emissive={MATRIX_GREEN} emissiveIntensity={5} />
            </mesh>
            {hasLight && (
              <pointLight position={[0, 2.2, 0]} color={MATRIX_GREEN} intensity={1} distance={4} decay={2} />
            )}
          </group>
        );
      })}
    </>
  );
}

/* ─── Steam Vents ─── */
function SteamVents() {
  const ventsRef = useRef<THREE.InstancedMesh>(null);
  const ventCount = 4;
  const particlesPerVent = 50;
  const totalParticles = ventCount * particlesPerVent;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const ventPositions = useMemo(() => [
    [-6.5, 0.15, -25] as [number, number, number],
    [6.5, 0.15, -60] as [number, number, number],
    [-6, 0.15, -110] as [number, number, number],
    [7, 0.15, -150] as [number, number, number],
  ], []);

  const particleData = useMemo(() => {
    return Array.from({ length: totalParticles }, (_, i) => {
      const ventIdx = Math.floor(i / particlesPerVent);
      return {
        ventIdx,
        offsetX: (Math.random() - 0.5) * 0.4,
        offsetZ: (Math.random() - 0.5) * 0.4,
        yOffset: Math.random() * 3,
        speed: 0.01 + Math.random() * 0.02,
      };
    });
  }, [totalParticles]);

  useFrame(() => {
    if (!ventsRef.current) return;
    for (let i = 0; i < totalParticles; i++) {
      const pd = particleData[i];
      const vp = ventPositions[pd.ventIdx];
      pd.yOffset += pd.speed;
      if (pd.yOffset > 3) pd.yOffset = 0;
      const opacity = 1 - pd.yOffset / 3;
      const s = 0.03 + pd.yOffset * 0.02;
      dummy.position.set(vp[0] + pd.offsetX, vp[1] + pd.yOffset, vp[2] + pd.offsetZ);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      ventsRef.current.setMatrixAt(i, dummy.matrix);
    }
    ventsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Pipe meshes */}
      {ventPositions.map((vp, i) => (
        <mesh key={`vpipe${i}`} position={vp}>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
          <meshStandardMaterial color="#222228" metalness={0.7} roughness={0.5} />
        </mesh>
      ))}
      {/* Steam particles */}
      <instancedMesh ref={ventsRef} args={[undefined, undefined, totalParticles]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#AACCAA" transparent opacity={0.12} depthWrite={false} />
      </instancedMesh>
    </>
  );
}

/* ─── Overhead Cables ─── */
function OverheadCables() {
  const cables = useMemo(() => {
    const result: { points: THREE.Vector3[] }[] = [];
    for (let z = 10; z > -180; z -= 30) {
      const leftX = -(12 + Math.random() * 3);
      const rightX = 12 + Math.random() * 3;
      const y = 12 + Math.random() * 8;
      const droopY = y - 1.5 - Math.random() * 2;
      result.push({
        points: [
          new THREE.Vector3(leftX, y, z),
          new THREE.Vector3(0, droopY, z),
          new THREE.Vector3(rightX, y, z),
        ],
      });
    }
    return result;
  }, []);

  return (
    <>
      {cables.map((cable, i) => {
        const curve = new THREE.CatmullRomCurve3(cable.points);
        return (
          <mesh key={`cable${i}`}>
            <tubeGeometry args={[curve, 20, 0.015, 4, false]} />
            <meshStandardMaterial color="#0A0A0A" metalness={0.9} roughness={0.3} />
          </mesh>
        );
      })}
    </>
  );
}

/* ─── Background Silhouette Buildings ─── */
function BackgroundBuildings() {
  const bgMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0A0A10', roughness: 0.9, metalness: 0 }), []);

  const buildings = useMemo(() => {
    const result: { pos: [number, number, number]; w: number; h: number; d: number; windowY: number[] }[] = [];
    for (let i = 0; i < 25; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (25 + Math.random() * 35);
      const h = 50 + Math.random() * 50;
      const w = 8 + Math.random() * 15;
      const d = 8 + Math.random() * 10;
      const z = 30 - Math.random() * 250;
      const winCount = Math.floor(Math.random() * 4);
      const windowY: number[] = [];
      for (let wi = 0; wi < winCount; wi++) {
        windowY.push(5 + Math.random() * (h - 10));
      }
      result.push({ pos: [x, h / 2, z], w, h, d, windowY });
    }
    return result;
  }, []);

  return (
    <>
      {buildings.map((b, i) => (
        <group key={`bg${i}`} position={b.pos}>
          <mesh frustumCulled material={bgMat}>
            <boxGeometry args={[b.w, b.h, b.d]} />
          </mesh>
          {b.windowY.map((wy, wi) => (
            <mesh key={`bgw${wi}`} position={[0, wy - b.h / 2, b.d / 2 + 0.01]}>
              <planeGeometry args={[0.8, 1.2]} />
              <meshStandardMaterial color="#000" emissive="#AAFF88" emissiveIntensity={0.3} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

/* ─── City Environment ─── */
function CityEnvironment({ onStallClick }: { onStallClick: (id: string) => void }) {
  const isMobile = useIsMobile();
  const { roadMap, brickMap, sidewalkMap } = useProceduralTextures();

  const buildings = useMemo(() => {
    const result: BuildingData[] = [];
    for (let z = 40; z > -195; z -= (6 + Math.random() * 4)) {
      for (const side of [-1, 1]) {
        const w = 5 + Math.random() * 9;
        const h = 10 + Math.random() * 35;
        const d = 8 + Math.random() * 6;
        const xOff = 12 + Math.random() * 6;
        const maxHalfWidth = Math.abs(side * xOff) - 10 - 0.5;
        const clampedW = Math.min(w, maxHalfWidth * 2);
        const trimCount = 2 + Math.floor(Math.random() * 3);
        const trims: BuildingData['trims'] = [];
        const allowTrimLights = result.length < 3;
        for (let t = 0; t < trimCount; t++) {
          const trimY = 2 + Math.random() * (h - 3);
          trims.push({
            y: trimY,
            color: Math.random() < 0.7 ? MATRIX_GREEN : NEON_CYAN,
            hasLight: allowTrimLights && t === 0,
          });
        }
        const windows: BuildingData['windows'] = [];
        const cols = Math.max(1, Math.floor(clampedW / 1.5));
        const rows = Math.max(1, Math.floor(h / 2));
        const faceZ = side * (d / 2 + 0.01);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (Math.random() < 0.4) continue;
            windows.push({
              x: -clampedW / 2 + 0.8 + c * ((clampedW - 1) / Math.max(cols - 1, 1)),
              y: -h / 2 + 1.5 + r * ((h - 2) / Math.max(rows - 1, 1)),
              z: faceZ,
              on: Math.random() > 0.4,
              color: Math.random() < 0.8 ? '#AAFF88' : '#88FFCC',
            });
          }
        }

        // Road-facing windows (on the inner X-face)
        const roadFaceDir = -side; // points toward road (x=0)
        const roadFaceX = roadFaceDir * (clampedW / 2 + 0.01);
        const roadWindows: BuildingData['roadWindows'] = [];
        const roadCols = Math.max(1, Math.floor(d / 1.5));
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < roadCols; c++) {
            if (Math.random() < 0.4) continue;
            roadWindows.push({
              z: -d / 2 + 0.8 + c * ((d - 1) / Math.max(roadCols - 1, 1)),
              y: -h / 2 + 1.5 + r * ((h - 2) / Math.max(rows - 1, 1)),
              on: Math.random() > 0.4,
              color: Math.random() < 0.8 ? '#AAFF88' : '#88FFCC',
            });
          }
        }

        const doorPositions: number[] = [];
        if (clampedW > 8) {
          doorPositions.push(-2.5, 2.5);
        } else {
          doorPositions.push(0);
        }

        const hasBalcony = Math.random() < 0.4;
        const balconyFloors: number[] = [];
        if (hasBalcony) {
          for (let bf = 2; bf <= 5 && bf * (h / 6) < h; bf++) {
            balconyFloors.push(bf * (h / 6));
          }
        }

        result.push({
          pos: [side * xOff, h / 2, z + Math.random() * 3],
          w: clampedW, h, d, trims, windows,
          hasFireEscape: Math.random() < 0.5,
          fireEscapeY: 0.3 * h, side,
          hasBalcony,
          balconyFloors,
          hasWaterTower: h > 20 && Math.random() < 0.3,
          hasAntenna: Math.random() < 0.2,
          doorPositions,
          roadFaceX,
          roadFaceDir,
          roadWindows,
        });
      }
    }
    return result;
  }, []);

  const streetLamps = useMemo(() => {
    const lamps: { pos: [number, number, number]; side: number }[] = [];
    let s = 1;
    for (let z = 25; z > -210; z -= 18) {
      lamps.push({ pos: [s * 5.5, 0, z], side: s });
      s *= -1;
    }
    return lamps.slice(0, 8);
  }, []);

  const neonAccents = useMemo(() => {
    const accents: { pos: [number, number, number]; color: string }[] = [];
    for (let z = 20; z > -200; z -= 25) {
      const side = Math.random() > 0.5 ? -1 : 1;
      accents.push({
        pos: [side * (12 + Math.random() * 5), 3 + Math.random() * 12, z],
        color: Math.random() < 0.7 ? MATRIX_GREEN : NEON_CYAN,
      });
    }
    return accents;
  }, []);

  return (
    <>
      <GroundSystem roadMap={roadMap} sidewalkMap={sidewalkMap} />
      <RoadMarkings />

      {buildings.map((b, i) => (
        <Building key={i} data={b} brickMap={brickMap} />
      ))}

      {streetLamps.map((l, i) => (
        <StreetLamp key={`lamp-${i}`} position={l.pos} side={l.side} />
      ))}

      {neonAccents.map((a, i) => (
        <NeonHalo key={`halo-${i}`} position={a.pos} color={a.color} scale={5} />
      ))}

      {/* Drones */}
      <SocialDrone center={[0, 8, -40]} color={MATRIX_GREEN} orbitRadiusX={5} orbitRadiusZ={8} speed={0.18}
        platform="GitHub" label="SOURCE CODE" link="https://github.com/YOUR_USERNAME" IconComponent={GithubSVG} />
      <SocialDrone center={[0, 8, -70]} color="#FF2D78" orbitRadiusX={4} orbitRadiusZ={7} speed={0.22}
        platform="Instagram" label="FOLLOW" link="https://instagram.com/YOUR_USERNAME" IconComponent={InstagramSVG} />
      <SocialDrone center={[0, 8, -100]} color={NEON_CYAN} orbitRadiusX={5} orbitRadiusZ={8} speed={0.15}
        platform="Email" label="TRANSMIT" link="mailto:your@email.com" IconComponent={EmailSVG} />

      <EndOfStreetBuilding brickMap={brickMap} />

      {/* Navigation stalls */}
      <NavigationStalls onStallClick={onStallClick} />

      {/* Street life */}
      <StreetProps isMobile={isMobile} />

      {/* Atmosphere — skip on mobile */}
      {!isMobile && <SteamVents />}
      {!isMobile && <OverheadCables />}
      {!isMobile && <BackgroundBuildings />}

      <RainParticles count={isMobile ? 80 : 400} />
      <FloatingDust />
      <Stars radius={200} depth={60} count={1500} factor={4} saturation={0} />
      <CityGlowDome />

      {/* Neon Shop Signs on road-facing walls */}
      <NeonShopSigns buildings={buildings} />

      {/* Lighting */}
      <ambientLight intensity={1.6} color="#334433" />
      <directionalLight position={[0, 30, 20]} color="#AAFFAA" intensity={1.2} />
      <spotLight position={[0, 15, 35]} color={MATRIX_GREEN} intensity={40} angle={0.6} penumbra={0.8} castShadow={false} />
      <directionalLight position={[5, 20, 10]} color="#00FF88" intensity={1.5} />
      <pointLight position={[0, 5, -100]} color={NEON_CYAN} intensity={4} distance={25} decay={2} />

      {/* Street-level fill lights for road-facing facades */}
      <pointLight position={[0, 10, 0]} color="#FFFFFF" intensity={1.2} distance={50} decay={2} />
      <pointLight position={[0, 10, -60]} color="#FFFFFF" intensity={1.2} distance={50} decay={2} />
      <pointLight position={[0, 10, -120]} color="#FFFFFF" intensity={1.2} distance={50} decay={2} />
      <pointLight position={[0, 10, -180]} color="#FFFFFF" intensity={1.2} distance={50} decay={2} />
    </>
  );
}

/* ─── Neon Shop Signs ─── */
function NeonShopSigns({ buildings }: { buildings: BuildingData[] }) {
  const signs = useMemo(() => {
    const SIGN_WORDS = ['RAMEN', 'DATA', 'SYNTH', 'NEON', 'CYBER', 'VOID', 'PULSE', 'HACK'];
    const SIGN_COLORS = ['#FF00FF', '#00FFFF', '#FF6600', '#FF2D78', '#00FF88'];
    const result: { pos: [number, number, number]; rotY: number; text: string; color: string }[] = [];
    // Pick 3 buildings spread across the street
    const candidates = buildings.filter((_, i) => i % 8 === 2 || i % 8 === 5 || i % 8 === 7).slice(0, 3);
    candidates.forEach((b, i) => {
      const signY = -b.h / 2 + 3 + Math.random() * 2;
      const signZ = b.pos[2];
      const signX = b.pos[0] + b.roadFaceDir * (b.w / 2 + 0.06);
      result.push({
        pos: [signX, b.pos[1] + signY, signZ],
        rotY: -b.roadFaceDir * Math.PI / 2,
        text: SIGN_WORDS[i % SIGN_WORDS.length],
        color: SIGN_COLORS[i % SIGN_COLORS.length],
      });
    });
    return result;
  }, [buildings]);

  return (
    <>
      {signs.map((sign, i) => (
        <group key={`nsign${i}`} position={sign.pos} rotation={[0, sign.rotY, 0]}>
          {/* Sign backing */}
          <mesh position={[0, 0, -0.03]}>
            <boxGeometry args={[2.2, 0.7, 0.06]} />
            <meshStandardMaterial color="#0A0A14" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Neon border */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.0, 0.6]} />
            <meshStandardMaterial color="#000" emissive={sign.color} emissiveIntensity={3} side={THREE.DoubleSide} />
          </mesh>
          {/* Text label via Html */}
          <Html position={[0, 0, 0.04]} transform occlude={false} distanceFactor={6} style={{ pointerEvents: 'none' }}>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 800,
              color: sign.color, letterSpacing: '0.3em', textAlign: 'center',
              textShadow: `0 0 12px ${sign.color}, 0 0 24px ${sign.color}55`,
              whiteSpace: 'nowrap',
            }}>{sign.text}</div>
          </Html>
          {/* Point light glow */}
          <pointLight position={[0, 0, 0.5]} color={sign.color} intensity={4} distance={8} decay={2} />
        </group>
      ))}
    </>
  );
}

/* ─── Loading Screen ─── */
function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0a0a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '24px',
    }}>
      <div style={{
        width: '60px', height: '60px',
        border: '3px solid transparent',
        borderTopColor: '#00FF88',
        borderRadius: '50%',
        animation: 'loadingSpin 1s linear infinite',
        boxShadow: '0 0 20px #00FF8844, inset 0 0 20px #00FF8822',
      }} />
      <p style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '13px', letterSpacing: '0.25em',
        color: '#00FF88', textTransform: 'uppercase',
        animation: 'loadingPulse 1.5s ease-in-out infinite',
      }}>INITIALISING CITY...</p>
      <style>{`
        @keyframes loadingSpin { to { transform: rotate(360deg); } }
        @keyframes loadingPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

/* ─── Main Export ─── */
export default function CityScene({ scrollProgress, onStallClick }: { scrollProgress: number; onStallClick: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-0">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          camera={{ fov: 65, near: 0.1, far: 600, position: [0, 3, 30] }}
          gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 1]}
        >
          <MatrixFog />
          <CameraController scrollProgress={scrollProgress} />
          <CityEnvironment onStallClick={onStallClick} />
        </Canvas>
      </Suspense>
    </div>
  );
}
