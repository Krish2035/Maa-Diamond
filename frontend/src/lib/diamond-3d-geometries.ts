import * as THREE from "three";

export type DiamondCutShape =
  | "Round"
  | "Pear"
  | "Marquise"
  | "Oval"
  | "Cushion"
  | "Princess"
  | "Trapezoid"
  | "Triangle"
  | "Trillion"
  | "Baguette"
  | "Rose Cut"
  | string;

/**
 * Creates a faceted diamond BufferGeometry from 2D girdle points,
 * table scaling, crown height, and pavilion depth.
 */
function createFacetedDiamondGeometry(
  girdlePoints: { x: number; y: number }[],
  tableScale: number = 0.55,
  crownHeight: number = 0.4,
  pavilionDepth: number = 0.85,
  girdleThickness: number = 0.05
): THREE.BufferGeometry {
  const vertices: number[] = [];
  const indices: number[] = [];
  const n = girdlePoints.length;

  // 0: Culet vertex at bottom
  vertices.push(0, -pavilionDepth, 0);

  // 1 to n: Lower girdle vertices (y = -girdleThickness/2)
  for (let i = 0; i < n; i++) {
    vertices.push(girdlePoints[i].x, -girdleThickness / 2, girdlePoints[i].y);
  }

  // (n+1) to 2n: Upper girdle vertices (y = girdleThickness/2)
  for (let i = 0; i < n; i++) {
    vertices.push(girdlePoints[i].x, girdleThickness / 2, girdlePoints[i].y);
  }

  // (2n+1) to 3n: Table edge vertices (y = crownHeight)
  for (let i = 0; i < n; i++) {
    vertices.push(
      girdlePoints[i].x * tableScale,
      crownHeight,
      girdlePoints[i].y * tableScale
    );
  }

  // 3n + 1: Center of Table
  const tableCenterIdx = 3 * n + 1;
  vertices.push(0, crownHeight, 0);

  // 1. Pavilion Facets (connecting culet 0 to lower girdle)
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    const g1 = 1 + i;
    const g2 = 1 + next;
    indices.push(0, g1, g2);
  }

  // 2. Girdle Facets (vertical rim between lower and upper girdle)
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    const lower1 = 1 + i;
    const lower2 = 1 + next;
    const upper1 = 1 + n + i;
    const upper2 = 1 + n + next;
    indices.push(lower1, upper1, upper2);
    indices.push(lower1, upper2, lower2);
  }

  // 3. Crown Facets (between upper girdle and table rim)
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    const ug1 = 1 + n + i;
    const ug2 = 1 + n + next;
    const t1 = 1 + 2 * n + i;
    const t2 = 1 + 2 * n + next;
    indices.push(ug1, t1, t2);
    indices.push(ug1, t2, ug2);
  }

  // 4. Table Facet (flat top face)
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    const t1 = 1 + 2 * n + i;
    const t2 = 1 + 2 * n + next;
    indices.push(tableCenterIdx, t2, t1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Returns a 3D BufferGeometry tailored for each of the 11 diamond cuts.
 */
export function getDiamondGeometry(shapeName: string): THREE.BufferGeometry {
  const normalized = shapeName.toLowerCase().trim();

  switch (normalized) {
    case "pear": {
      // Teardrop: rounded lobe at bottom, sharp pointed tip at top
      const pts: { x: number; y: number }[] = [];
      const count = 36;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        // Asymmetric egg/teardrop curve
        const sin = Math.sin(theta);
        const cos = Math.cos(theta);
        const x = sin * 0.95;
        // Taper upwards to a sharp point
        const y = -cos * (1 - 0.42 * sin) * 1.35;
        pts.push({ x, y });
      }
      return createFacetedDiamondGeometry(pts, 0.52, 0.42, 0.9, 0.04);
    }

    case "marquise":
    case "marques": {
      // Double-pointed football / navette shape
      const pts: { x: number; y: number }[] = [];
      const count = 32;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        const x = Math.sin(theta) * 0.65;
        // Sharpen both ends
        const y = Math.sign(Math.cos(theta)) * Math.pow(Math.abs(Math.cos(theta)), 1.4) * 1.6;
        pts.push({ x, y });
      }
      return createFacetedDiamondGeometry(pts, 0.5, 0.4, 0.95, 0.04);
    }

    case "oval": {
      // Symmetrical ellipse
      const pts: { x: number; y: number }[] = [];
      const count = 32;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        pts.push({
          x: Math.sin(theta) * 0.9,
          y: Math.cos(theta) * 1.35,
        });
      }
      return createFacetedDiamondGeometry(pts, 0.55, 0.4, 0.88, 0.04);
    }

    case "princess": {
      // Square with sharp 90-degree corners
      const pts = [
        { x: -0.95, y: -0.95 },
        { x: 0.95, y: -0.95 },
        { x: 0.95, y: 0.95 },
        { x: -0.95, y: 0.95 },
      ];
      return createFacetedDiamondGeometry(pts, 0.65, 0.38, 0.92, 0.03);
    }

    case "cushion": {
      // Pillowed square / super-ellipse
      const pts: { x: number; y: number }[] = [];
      const count = 32;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        // Squircle formula (n = 3.5)
        const r = 1.05 / Math.pow(Math.pow(Math.abs(cos), 3.5) + Math.pow(Math.abs(sin), 3.5), 1 / 3.5);
        pts.push({ x: sin * r * 0.92, y: cos * r * 0.95 });
      }
      return createFacetedDiamondGeometry(pts, 0.6, 0.38, 0.88, 0.04);
    }

    case "trapezoid": {
      // Tapered trapezoid
      const pts = [
        { x: -1.0, y: -0.65 },
        { x: 1.0, y: -0.65 },
        { x: 0.6, y: 0.65 },
        { x: -0.6, y: 0.65 },
      ];
      return createFacetedDiamondGeometry(pts, 0.58, 0.35, 0.8, 0.04);
    }

    case "triangle": {
      // Sharp equilateral triangle
      const pts = [
        { x: 0, y: 1.25 },
        { x: 1.15, y: -0.75 },
        { x: -1.15, y: -0.75 },
      ];
      return createFacetedDiamondGeometry(pts, 0.52, 0.38, 0.85, 0.03);
    }

    case "trillion": {
      // Curved-edge brilliant triangle
      const pts: { x: number; y: number }[] = [];
      const sides = 3;
      const ptsPerSide = 10;
      for (let s = 0; s < sides; s++) {
        const a1 = (s * 2 * Math.PI) / 3 + Math.PI / 2;
        const a2 = ((s + 1) * 2 * Math.PI) / 3 + Math.PI / 2;
        const p1 = { x: Math.cos(a1) * 1.25, y: Math.sin(a1) * 1.25 };
        const p2 = { x: Math.cos(a2) * 1.25, y: Math.sin(a2) * 1.25 };
        for (let i = 0; i < ptsPerSide; i++) {
          const t = i / ptsPerSide;
          const x = p1.x * (1 - t) + p2.x * t;
          const y = p1.y * (1 - t) + p2.y * t;
          // Add gentle outward curve
          const dist = Math.sqrt(x * x + y * y);
          const bulge = 1.08;
          pts.push({ x: (x / dist) * Math.max(dist, 1.0) * bulge * 0.95, y: (y / dist) * Math.max(dist, 1.0) * bulge * 0.95 });
        }
      }
      return createFacetedDiamondGeometry(pts, 0.55, 0.4, 0.88, 0.04);
    }

    case "baguette": {
      // Clean elongated step-cut rectangle
      const pts = [
        { x: -0.65, y: -1.25 },
        { x: 0.65, y: -1.25 },
        { x: 0.65, y: 1.25 },
        { x: -0.65, y: 1.25 },
      ];
      return createFacetedDiamondGeometry(pts, 0.68, 0.32, 0.75, 0.04);
    }

    case "rose cut":
    case "rosecut": {
      // Rose cut: flat circular base at bottom, faceted domed apex at top
      const pts: { x: number; y: number }[] = [];
      const count = 24;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        pts.push({ x: Math.sin(theta) * 1.1, y: Math.cos(theta) * 1.1 });
      }
      // Shallow base (flat culet), domed crown
      return createFacetedDiamondGeometry(pts, 0.45, 0.65, 0.1, 0.03);
    }

    case "round":
    default: {
      // Classic 16-faceted Round Brilliant cut
      const pts: { x: number; y: number }[] = [];
      const count = 24;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        pts.push({ x: Math.sin(theta) * 1.1, y: Math.cos(theta) * 1.1 });
      }
      return createFacetedDiamondGeometry(pts, 0.56, 0.42, 0.92, 0.04);
    }
  }
}
