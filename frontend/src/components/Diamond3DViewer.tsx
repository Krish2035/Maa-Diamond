"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getDiamondGeometry } from "@/lib/diamond-3d-geometries";
import { Rotate3d, Sparkles } from "lucide-react";

interface Diamond3DViewerProps {
  shape: string;
  className?: string;
  autoRotateSpeed?: number;
}

export default function Diamond3DViewer({
  shape,
  className = "w-full h-full",
  autoRotateSpeed = 0.012,
}: Diamond3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 200;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.9, 2.7);
    camera.lookAt(0, -0.05, 0);

    // 2. WebGL Renderer with High Precision
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Rig (Simulates Gemological Ring & Fire Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Top Key Light
    const topKey = new THREE.DirectionalLight(0xffffff, 2.8);
    topKey.position.set(0, 4, 3);
    scene.add(topKey);

    // Bottom Culet Reflector Light
    const bottomReflector = new THREE.DirectionalLight(0xdbeafe, 1.4);
    bottomReflector.position.set(0, -3, -1);
    scene.add(bottomReflector);

    // Warm Fire Sparkle (Amber / Golden Flash)
    const warmSparkle = new THREE.PointLight(0xfef08a, 2.2, 10);
    warmSparkle.position.set(2.5, 1.5, 2);
    scene.add(warmSparkle);

    // Cool Fire Sparkle (Ice Blue Flash)
    const coolSparkle = new THREE.PointLight(0x93c5fd, 2.2, 10);
    coolSparkle.position.set(-2.5, 1.5, 2);
    scene.add(coolSparkle);

    // 4. Diamond Geometry & Materials
    const geometry = getDiamondGeometry(shape);

    // Diamond Body Material (Faceted Optical Dispersion)
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.08,
      roughness: 0.04,
      transmission: 0.92,
      ior: 2.417, // Authentic physical refractive index of diamond
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transparent: true,
      opacity: 0.96,
      attenuationColor: new THREE.Color(0xffffff),
      attenuationDistance: 1.5,
    });

    const diamondMesh = new THREE.Mesh(geometry, diamondMaterial);

    // Facet Crisp Edge Lines (Creates sparkling gemological facet borders)
    const edgesGeom = new THREE.EdgesGeometry(geometry, 12);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      linewidth: 1,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeom, edgesMaterial);

    // Diamond Group for coordinated rotation & initial forward tilt
    const diamondGroup = new THREE.Group();
    diamondGroup.add(diamondMesh);
    diamondGroup.add(edgesMesh);
    // Initial 16-degree tilt to showcase both crown table and pavilion depth
    diamondGroup.rotation.x = 0.28;
    scene.add(diamondGroup);

    setIsReady(true);

    // 5. Interactive Drag & Spin Controls
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let deltaX = 0;
    let deltaY = 0;
    let currentAutoSpeed = autoRotateSpeed;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
      deltaX = 0;
      deltaY = 0;
      currentAutoSpeed = 0;
      setHasInteracted(true);
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      deltaX = e.clientX - previousPointerX;
      deltaY = e.clientY - previousPointerY;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;

      diamondGroup.rotation.y += deltaX * 0.008;
      // Clamp vertical tilt between -0.4 and 0.8
      diamondGroup.rotation.x = Math.max(
        -0.4,
        Math.min(0.8, diamondGroup.rotation.x + deltaY * 0.006)
      );
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = "grab";
    };

    const domElement = renderer.domElement;
    domElement.style.touchAction = "none";
    domElement.style.cursor = "grab";

    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // 6. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 7. Animation Loop with Facet Scintillation
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.02;

      // Smooth momentum / auto-rotation resumption
      if (!isDragging) {
        deltaX *= 0.94;
        deltaY *= 0.94;
        diamondGroup.rotation.y += deltaX * 0.008;
        diamondGroup.rotation.x += deltaY * 0.006;

        // Resume gentle auto-rotation when user releases
        if (Math.abs(deltaX) < 0.1) {
          currentAutoSpeed = THREE.MathUtils.lerp(
            currentAutoSpeed,
            autoRotateSpeed,
            0.05
          );
        }
        diamondGroup.rotation.y += currentAutoSpeed;
      }

      // Orbital scintillation of fire lights
      warmSparkle.position.x = Math.sin(time * 0.8) * 3;
      warmSparkle.position.z = Math.cos(time * 0.8) * 3;
      coolSparkle.position.x = -Math.sin(time * 0.8) * 3;
      coolSparkle.position.z = -Math.cos(time * 0.8) * 3;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      resizeObserver.disconnect();
      geometry.dispose();
      edgesGeom.dispose();
      diamondMaterial.dispose();
      edgesMaterial.dispose();
      renderer.dispose();
      if (domElement.parentElement === container) {
        container.removeChild(domElement);
      }
    };
  }, [shape, autoRotateSpeed]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-black ${className}`}>
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="h-full w-full select-none" />

      {/* Floating 3D Badge */}
      <div className="pointer-events-none absolute top-2 left-2 z-10 flex items-center gap-1 rounded bg-black/75 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/30 backdrop-blur-sm shadow-xs">
        <Rotate3d className="h-3 w-3 animate-spin text-amber-400" />
        <span>3D 360° Spin</span>
      </div>

      {/* Interactive Helper Pill (fades after first drag) */}
      {!hasInteracted && isReady && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-semibold text-slate-200 border border-slate-700 backdrop-blur-md shadow-md animate-pulse">
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>Drag to rotate in 360°</span>
        </div>
      )}
    </div>
  );
}
