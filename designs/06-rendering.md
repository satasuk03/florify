# Step 06 — 3D Rendering (Three.js)

**Goal:** ได้ scene ที่ render ต้นไม้จาก `BuiltTree` ได้สวย เข้ากับ theme off-white warm, รันได้ 60fps บน mid-range mobile, และ support orbit/zoom ตลอดเวลา (รวม cooldown)

**Estimated time:** 1–2 วัน

---

## 6.1 Stack

ใช้ `@react-three/fiber` + `@react-three/drei` เพื่อลด boilerplate และเขียน scene เป็น React components

## 6.2 Scene Setup (`src/three/Scene.tsx`)

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { Ground } from './Ground';
import { ActiveTreeMesh } from './ActiveTreeMesh';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Scene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [3, 2.2, 4], fov: 40, near: 0.1, far: 100 }}
      onCreated={({ scene }) => {
        scene.background = null;          // ให้ CSS bg โชว์ผ่าน (cream.50)
      }}
    >
      {/* Warm morning lighting */}
      <ambientLight color="#F0DFC4" intensity={0.55} />
      <directionalLight
        color="#FFE8C8"
        intensity={1.1}
        position={[5, 8, 3]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={['#FBF8F3', '#D1C0A0', 0.35]} />
      <fog attach="fog" args={['#F3E9D6', 10, 28]} />

      <Ground />
      <ActiveTreeMesh />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={12}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.48}
        autoRotate={!reduced}
        autoRotateSpeed={0.35}
        dampingFactor={0.08}
        enableDamping
      />
    </Canvas>
  );
}
```

**Key decisions:**
- `enableRotate + enableZoom = true` เสมอ (รวมตอน cooldown) — ผู้เล่นปั่นดูต้นไม้ของตัวเองได้
- `enablePan = false` กันเผลอ pan หลุด
- Auto-rotate ช้าๆ ให้ต้นไม้ดูมีชีวิต (ปิดถ้า reducedMotion)
- `dpr={[1, 2]}` cap เพื่อ mobile perf

## 6.3 Ground Component

```tsx
// src/three/Ground.tsx
import * as THREE from 'three';

export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[10, 48]} />
      <meshStandardMaterial color="#E3D7C0" roughness={0.95} metalness={0} />
    </mesh>
  );
}
```
สีดินเข้ากับ theme (cream-300/clay family), ไม่ใช่ grey

## 6.4 Tree Mesh Component

```tsx
// src/three/ActiveTreeMesh.tsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { getTree } from '@/engine/treeCache';

export function ActiveTreeMesh() {
  const tree = useGameStore(s => s.state.activeTree);
  if (!tree) return <EmptyPot />;
  return <TreeMesh speciesId={tree.speciesId} seed={tree.seed} progress={tree.currentWaterings / tree.requiredWaterings} />;
}

function TreeMesh({ speciesId, seed, progress }: { speciesId: number; seed: number; progress: number }) {
  const built = useMemo(() => getTree(speciesId, seed), [speciesId, seed]);

  // ── Growth system (3 layers ทำงานพร้อมกัน) ─────────────
  // 1. Overall scale:    0.35 → 1.0  (ต้นใหญ่ขึ้น)
  // 2. Trunk reveal:     ใช้ clip shader ค่อยๆ ดันขึ้นจากพื้น
  // 3. Leaf reveal:      แต่ละใบมี birthThreshold 0..1; โผล่เมื่อ progress >= threshold
  //                      → ใบที่อยู่ trunk ก่อนโผล่ก่อน, ใบปลายกิ่งโผล่ทีหลัง
  // 4. Sway/breathing:   wind animation ตลอดเวลา แม้ idle
  const groupRef = useRef<THREE.Group>(null);
  const leafMatRef = useRef<THREE.ShaderMaterial>(null);

  // Smooth-animated progress (lerps toward target to make watering feel juicy)
  const smoothProgress = useRef(progress);
  useFrame((state, dt) => {
    // 1) Smooth interp progress
    smoothProgress.current += (progress - smoothProgress.current) * Math.min(1, dt * 2);
    const p = smoothProgress.current;

    // 2) Group scale: ease-out curve (โตเร็วช่วงแรก ช้าช่วงหลัง = รู้สึก rewarding)
    const targetScale = 0.35 + easeOutCubic(p) * 0.65;
    const g = groupRef.current;
    if (g) {
      g.scale.setScalar(targetScale);
      // Subtle sway — breathing animation
      g.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.015;
    }

    // 3) Push progress into leaf shader uniform (for birth-threshold reveal)
    if (leafMatRef.current) {
      leafMatRef.current.uniforms.uProgress.value = p;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={built.trunk} castShadow receiveShadow>
        <meshStandardMaterial color={built.trunkColor} roughness={0.85} />
      </mesh>
      <LeafInstances
        positions={built.leafPositions}
        scales={built.leafScales}
        birthThresholds={built.leafBirthThresholds}  // 0..1 per leaf, based on depth in tree
        color={built.leafColor}
        matRef={leafMatRef}
      />
    </group>
  );
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
```

### How the growth feels

| Progress | Visual |
|---|---|
| 0% (plant) | เห็นแค่ลำต้นเล็กๆ, ใบ 0 ใบ, ต้นสูง ~35% ของเต็ม |
| 25% | ลำต้นใหญ่ขึ้น, ใบชั้นล่างสุดเริ่มโผล่ |
| 50% | กิ่งกลางมีใบ, ต้นโต 70% |
| 75% | ใบเกือบเต็ม, กิ่งปลายเริ่มมีใบ |
| 100% | เต็มต้น, สวยงามพร้อม harvest |

**Key feeling:** ทุกครั้งที่รดน้ำ ผู้เล่นจะเห็น
1. ต้น pop ขึ้นนิดหน่อย (scale lerp)
2. ใบใหม่ "ผลิ" โผล่ออกมา (threshold reveal)
3. animation ทำงานใน ~1.5 วิ ทำให้รู้สึกคุ้มการกดปุ่ม

### ทำไมไม่แค่ scale อย่างเดียว?

Scale อย่างเดียว → ทุก %​ จะดูเหมือนซูมกล้องเข้า-ออก ต้นไม้ดู "ใหญ่ขึ้น" แต่ไม่ "เติบโต" การใช้ **leaf birth threshold** ทำให้เห็นชัดว่ามีการเปลี่ยนแปลงเชิง structural ทุกครั้งที่รดน้ำ ซึ่งเป็น feedback loop ที่สำคัญของเกมรดน้ำ

### Leaf shader (conceptual)

```glsl
// vertex shader — instanced leaf
uniform float uProgress;           // 0..1 from game
attribute float aBirthThreshold;   // 0..1 per instance
varying float vVisible;

void main() {
  float born = step(aBirthThreshold, uProgress);
  // Scale leaf from 0 → full over small window after birth
  float grow = smoothstep(aBirthThreshold, aBirthThreshold + 0.05, uProgress);
  float s = born * grow;
  vec3 scaled = position * s;
  // ... standard instance + modelView transform
  vVisible = s;
}
```

`built.leafBirthThresholds` ถูก assign ตอน build tree: ใบยิ่งอยู่ลึกใน L-system (ใกล้ปลายกิ่ง) → threshold สูง → โผล่ทีหลัง. เขียนไว้ใน step `04-tree-generator.md`

### LeafInstances (InstancedMesh)

```tsx
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const LEAF_GEO = new THREE.SphereGeometry(0.09, 5, 4);   // low-poly leaf blob

export function LeafInstances({
  positions, scales, color,
}: {
  positions: Float32Array;
  scales: Float32Array;
  color: THREE.Color;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = scales.length;

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions[i * 3]!,
        positions[i * 3 + 1]!,
        positions[i * 3 + 2]!,
      );
      const s = scales[i]!;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions, scales, count]);

  return (
    <instancedMesh ref={ref} args={[LEAF_GEO, undefined, count]} castShadow>
      <meshStandardMaterial color={color} roughness={0.7} />
    </instancedMesh>
  );
}
```

## 6.5 Empty Pot (no active tree state)

```tsx
// src/three/EmptyPot.tsx
export function EmptyPot() {
  return (
    <group position={[0, 0.15, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.3, 20]} />
        <meshStandardMaterial color="#A96842" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 20]} />
        <meshStandardMaterial color="#8A4E2C" />
      </mesh>
    </group>
  );
}
```

## 6.6 Thumbnail Renderer (สำหรับ Gallery)

```ts
// src/three/thumbnailRenderer.ts
import * as THREE from 'three';
import { getTree } from '@/engine/treeCache';

let _renderer: THREE.WebGLRenderer | null = null;
const cache = new Map<string, string>();

function getRenderer() {
  if (_renderer) return _renderer;
  _renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  _renderer.setSize(256, 256);
  return _renderer;
}

export function renderThumbnail(speciesId: number, seed: number): string {
  const key = `${speciesId}:${seed}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const built = getTree(speciesId, seed);
  const renderer = getRenderer();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#FBF8F3');

  scene.add(new THREE.AmbientLight('#F0DFC4', 0.6));
  const dir = new THREE.DirectionalLight('#FFE8C8', 1);
  dir.position.set(3, 5, 2);
  scene.add(dir);

  const trunkMat = new THREE.MeshStandardMaterial({ color: built.trunkColor, roughness: 0.85 });
  scene.add(new THREE.Mesh(built.trunk, trunkMat));

  // leaves (simplified: single instancedMesh)
  const leafGeo = new THREE.SphereGeometry(0.09, 5, 4);
  const leafMat = new THREE.MeshStandardMaterial({ color: built.leafColor, roughness: 0.7 });
  const inst = new THREE.InstancedMesh(leafGeo, leafMat, built.leafScales.length);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < built.leafScales.length; i++) {
    dummy.position.set(built.leafPositions[i*3]!, built.leafPositions[i*3+1]!, built.leafPositions[i*3+2]!);
    dummy.scale.setScalar(built.leafScales[i]!);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  }
  scene.add(inst);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const dist = Math.max(size.x, size.y, size.z) * 1.8;
  camera.position.set(center.x + dist, center.y + dist * 0.6, center.z + dist);
  camera.lookAt(center);

  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');
  cache.set(key, url);

  // cleanup scene objects (trunk geo owned by LRU, don't dispose)
  leafGeo.dispose();
  trunkMat.dispose();
  leafMat.dispose();

  return url;
}
```

## 6.7 Performance Budget

| Metric | Target | Strategy |
|---|---|---|
| FPS (mid mobile) | 60 | DPR cap, instanced leaves, low-poly geo |
| Triangles on screen | < 50k | iterations ≤ 5, cylinder radial = 6 |
| Draw calls | < 10 | Merge trunk, instance leaves |
| First tree render | < 500 ms | LRU cache + lazy species load |
| Tab hidden | Pause loop | `useFrame` auto-pauses via r3f |

## 6.8 Accessibility / Reduced Motion

```ts
// src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';
import { loadSettings } from '@/store/settingsStore';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return loadSettings().reducedMotion ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setReduced(mq.matches || loadSettings().reducedMotion);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}
```

## ✅ Definition of Done
- [ ] `<Scene />` render ได้โดยไม่มี error
- [ ] Active tree ปรากฏตรงกลาง scale ตาม progress
- [ ] Empty pot เมื่อไม่มี activeTree
- [ ] Orbit + zoom ทำงานด้วยนิ้วบน mobile (drag + pinch)
- [ ] Auto-rotate ช้าๆ (ปิดเมื่อ reducedMotion)
- [ ] Lighting + background อบอุ่นเข้ากับ theme cream-50
- [ ] `renderThumbnail` ส่ง PNG data URL 256×256
- [ ] 60 fps บน iPhone 12 / Pixel 6

ถัดไป → [`07-screens.md`](./07-screens.md)
