export type ShapeFormula = (size: number, angle?: number) => { x: number; y: number }[];

export const squareOutline: ShapeFormula = (size, angle = 0) => {
  const half = size / 2;

  const rotationAngle = angle + (Date.now() * 0.002);

  const angles = [Math.PI * -0.25, Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25];

  const radius = Math.sqrt(2) * half;

  const rotatedPoints = angles.map((a) => {
    const theta = a + rotationAngle;
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);
    return { x, y };
  });

  rotatedPoints.push(rotatedPoints[0]);

  return rotatedPoints;
};

export const diamondOutline: ShapeFormula = (size, angle = 0) => {
  const half = size / 2;
  
  const rotationAngle = angle + (Date.now() * 0.001);
  
  const basePoints = [
    { x: 0, y: -half },
    { x: half, y: 0 },
    { x: 0, y: half },
    { x: -half, y: 0 },
  ];

  const rotatedPoints = basePoints.map(({ x, y }) => {
    const rotatedX = x * Math.cos(rotationAngle) - y * Math.sin(rotationAngle);
    const rotatedY = x * Math.sin(rotationAngle) + y * Math.cos(rotationAngle);
    return { x: rotatedX, y: rotatedY };
  });

  rotatedPoints.push(rotatedPoints[0]);

  return rotatedPoints;
};
