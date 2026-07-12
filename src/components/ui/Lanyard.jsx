import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, Text } from "@react-three/drei";
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from "@react-three/rapier";
import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { extend } from "@react-three/fiber";

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ name = "Your Name", role = "Frontend Developer" }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        <ambientLight intensity={1.2} />
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band name={name} role={role} />
        </Physics>
        <Environment blur={0.8}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ name, role }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = useMemo(() => new THREE.Vector3(), []);
  const [dragged, setDragged] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.2, 0]]);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
    []
  );

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      vec.sub(state.camera.position).normalize();
      const dist = -state.camera.position.z / vec.z;
      const pos = state.camera.position.clone().add(vec.multiplyScalar(dist));
      card.current?.setNextKinematicTranslation(pos);
    }
    if (fixed.current) {
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.translation());
      curve.points[2].copy(j1.current.translation());
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
    }
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} type="fixed" />
        <RigidBody position={[0.5, 3, 0]} ref={j1}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 3, 0]} ref={j2}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 3, 0]} ref={j3}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 2, 0]}
          ref={card}
          type={dragged ? "kinematicPosition" : "dynamic"}
          angularDamping={2}
          linearDamping={2}
        >
          <CuboidCollider args={[0.8, 1.1, 0.01]} />
          <group
            scale={2.2}
            onPointerOver={() => (document.body.style.cursor = "grab")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              setDragged(true);
            }}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              setDragged(false);
            }}
          >
            <RoundedBox args={[0.8, 1.1, 0.02]} radius={0.05}>
              <meshPhysicalMaterial
                color="#161616"
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.6}
                metalness={0.3}
              />
            </RoundedBox>
            <Text position={[0, 0.25, 0.02]} fontSize={0.09} color="white" anchorX="center" anchorY="middle" maxWidth={0.7}>
              {name}
            </Text>
            <Text position={[0, 0.1, 0.02]} fontSize={0.05} color="#9a9a9a" anchorX="center" anchorY="middle" maxWidth={0.7}>
              {role}
            </Text>
            <mesh position={[0, -0.15, 0.02]}>
              <circleGeometry args={[0.16, 32]} />
              <meshBasicMaterial color="#2a2a2a" />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" lineWidth={0.06} />
      </mesh>
    </>
  );
}