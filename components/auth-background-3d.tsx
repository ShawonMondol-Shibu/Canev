"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

type ShapeType = "icosahedron" | "octahedron" | "torus" | "dodecahedron";

function Geometry({ shape }: { shape: ShapeType }) {
  switch (shape) {
    case "icosahedron": return <icosahedronGeometry args={[1, 0]} />;
    case "octahedron": return <octahedronGeometry args={[1, 0]} />;
    case "torus": return <torusGeometry args={[0.8, 0.3, 8, 16]} />;
    case "dodecahedron": return <dodecahedronGeometry args={[1, 0]} />;
  }
}

const SHAPES = [
  { position: [-4.5, -1.5, -3] as const, rotationSpeed: 0.8, distort: 0.3, color: "#2563eb", shape: "icosahedron" as ShapeType },
  { position: [4.5, 2.5, -5] as const, rotationSpeed: 1.2, distort: 0.5, color: "#f43f5e", shape: "torus" as ShapeType },
  { position: [-3, 3.5, -6] as const, rotationSpeed: 0.6, distort: 0.2, color: "#10b981", shape: "octahedron" as ShapeType },
  { position: [5, -2.5, -4] as const, rotationSpeed: 0.9, distort: 0.4, color: "#f59e0b", shape: "dodecahedron" as ShapeType },
  { position: [0, -3, -2] as const, rotationSpeed: 0.7, distort: 0.35, color: "gold", shape: "icosahedron" as ShapeType },
];

function FloatingShape({
  position,
  rotationSpeed,
  distort,
  color,
  shape,
}: (typeof SHAPES)[number]) {
  const ref = useRef<Mesh>(null);
  const skipRef = useRef(0);

  useFrame(() => {
    skipRef.current += 1;
    if (skipRef.current % 2 !== 0) return;
    if (ref.current) {
      ref.current.rotation.x += rotationSpeed * 0.005;
      ref.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <Geometry shape={shape} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={1}
          distort={distort}
          speed={1}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} intensity={0.8} angle={Math.PI / 4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      {SHAPES.map((s) => (
        <FloatingShape key={`${s.shape}-${s.position[0]}-${s.position[1]}`} {...s} />
      ))}
    </>
  );
}

export default function AuthBackground3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1]}
        gl={{ antialias: false, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
