import type { ShapeFormula } from '../../player/formulas';

export const circleProjectile: ShapeFormula = (size: number, angle: number = 0) => {
  const points: { x: number; y: number }[] = [];
  const segments = 16;
  
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push({
      x: Math.cos(theta) * size,
      y: Math.sin(theta) * size
    });
  }
  
  return points;
};

export const squareProjectile: ShapeFormula = (size: number, angle: number = 0) => {
  const halfSize = size / 2;
  return [
    { x: -halfSize, y: -halfSize },
    { x: halfSize, y: -halfSize },
    { x: halfSize, y: halfSize },
    { x: -halfSize, y: halfSize }
  ];
};

export const triangleProjectile: ShapeFormula = (size: number, angle: number = 0) => {
  const halfSize = size / 2;
  return [
    { x: halfSize, y: 0 },
    { x: -halfSize, y: -halfSize },
    { x: -halfSize, y: halfSize }
  ];
};

export const diamondProjectile: ShapeFormula = (size: number, angle: number = 0) => {
  const halfSize = size / 2;
  return [
    { x: 0, y: -halfSize },
    { x: halfSize, y: 0 },
    { x: 0, y: halfSize },
    { x: -halfSize, y: 0 }
  ];
};

export const crossProjectile: ShapeFormula = (size: number, angle: number = 0) => {
  const halfSize = size / 2;
  const quarterSize = size / 4;
  return [
    { x: -quarterSize, y: -halfSize },
    { x: quarterSize, y: -halfSize },
    { x: quarterSize, y: halfSize },
    { x: -quarterSize, y: halfSize },
    { x: -halfSize, y: -quarterSize },
    { x: halfSize, y: -quarterSize },
    { x: halfSize, y: quarterSize },
    { x: -halfSize, y: quarterSize }
  ];
};

export const starProjectile: ShapeFormula = (size: number, angle: number = 0) => {
  const points: { x: number; y: number }[] = [];
  const spikes = 5;
  const outerRadius = size / 2;
  const innerRadius = size / 4;
  
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const theta = (i / (spikes * 2)) * Math.PI * 2;
    points.push({
      x: Math.cos(theta) * radius,
      y: Math.sin(theta) * radius
    });
  }
  
  return points;
};

export const hexagonProjectile: ShapeFormula = (size: number, angle: number = 0) => {
  const points: { x: number; y: number }[] = [];
  const radius = size / 2;
  
  for (let i = 0; i < 6; i++) {
    const theta = (i / 6) * Math.PI * 2;
    points.push({
      x: Math.cos(theta) * radius,
      y: Math.sin(theta) * radius
    });
  }
  
  return points;
};

export const defaultProjectile = circleProjectile;

export const arrowProjectile: ShapeFormula = (size: number, angle: number = 0) => {
  type Point = { x: number; y: number };

  const generateCurve = (
    formula: (x: number) => number,
    domainStart: number,
    domainEnd: number,
    segments: number
  ): Point[] => {
    const scaleX = size / 2;
    const scaleY = size * 0.3;

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const curvePoints: Point[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const xRaw = domainStart + t * (domainEnd - domainStart);
      const yRaw = formula(xRaw);
      const x = xRaw * scaleX;
      const y = -yRaw * scaleY;

      const rotatedX = x * cosA - y * sinA;
      const rotatedY = x * sinA + y * cosA;

      curvePoints.push({ x: rotatedX, y: rotatedY });
    }

    return curvePoints;
  };

  const points1 = generateCurve(x => 3 * Math.pow(x - 1, 2), 0, 1, 20);

  const points2 = generateCurve(x => 3 * Math.pow(x + 1, 2), -1, 0, 20);

  return [...points1, ...points2];
};
