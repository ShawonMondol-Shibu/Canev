"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

function FloatingShape({
  position,
  rotationSpeed,
  distort,
  color,
  shape,
}: {
  position: [number, number, number];
  rotationSpeed: number;
  distort: number;
  color: string;
  shape: "icosahedron" | "octahedron" | "torus" | "dodecahedron";
}) {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeed * 0.005;
      ref.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} position={position}>
        {shape === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
        {shape === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {shape === "torus" && <torusGeometry args={[0.8, 0.3, 16, 32]} />}
        {shape === "dodecahedron" && <dodecahedronGeometry args={[1, 0]} />}
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={1}
          distort={distort}
          speed={2}
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
      <FloatingShape
        position={[-4.5, -1.5, -3]}
        rotationSpeed={0.8}
        distort={0.3}
        color="#2563eb"
        shape="icosahedron"
      />
      <FloatingShape
        position={[4.5, 2.5, -5]}
        rotationSpeed={1.2}
        distort={0.5}
        color="#f43f5e"
        shape="torus"
      />
      <FloatingShape
        position={[-3, 3.5, -6]}
        rotationSpeed={0.6}
        distort={0.2}
        color="#10b981"
        shape="octahedron"
      />
      <FloatingShape
        position={[5, -2.5, -4]}
        rotationSpeed={0.9}
        distort={0.4}
        color="#f59e0b"
        shape="dodecahedron"
      />
      <FloatingShape
        position={[0, -3, -2]}
        rotationSpeed={0.7}
        distort={0.35}
        color="gold"
        shape="icosahedron"
      />
    </>
  );
}

export default function AuthBackground3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
