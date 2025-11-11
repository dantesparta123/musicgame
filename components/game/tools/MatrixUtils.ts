import type p5 from 'p5';

/**
 * 将世界坐标转换为屏幕坐标
 * 手动应用矩阵变换，处理p5.js的3D变换
 * @param p p5实例
 * @param worldX 世界X坐标
 * @param worldY 世界Y坐标
 * @param worldZ 世界Z坐标（默认为0）
 * @returns 屏幕坐标 {x: number, y: number}
 */
export function worldToScreen(p: p5, worldX: number, worldY: number, worldZ: number = 0): { x: number; y: number } {
  // 获取当前的模型视图矩阵和投影矩阵
  const mvMatrix = (p as any)._renderer.uMVMatrix.copy();
  const pMatrix = (p as any)._renderer.uPMatrix.copy();
  
  // 创建世界坐标向量
  const v = p.createVector(worldX, worldY, worldZ);
  
  // 手动应用模型视图矩阵变换
  const mvVector = {
    x: v.x * mvMatrix.mat4[0] + v.y * mvMatrix.mat4[4] + v.z * mvMatrix.mat4[8] + mvMatrix.mat4[12],
    y: v.x * mvMatrix.mat4[1] + v.y * mvMatrix.mat4[5] + v.z * mvMatrix.mat4[9] + mvMatrix.mat4[13],
    z: v.x * mvMatrix.mat4[2] + v.y * mvMatrix.mat4[6] + v.z * mvMatrix.mat4[10] + mvMatrix.mat4[14]
  };
  
  // 手动应用投影矩阵变换
  const projected = {
    x: mvVector.x * pMatrix.mat4[0] + mvVector.y * pMatrix.mat4[4] + mvVector.z * pMatrix.mat4[8] + pMatrix.mat4[12],
    y: mvVector.x * pMatrix.mat4[1] + mvVector.y * pMatrix.mat4[5] + mvVector.z * pMatrix.mat4[9] + pMatrix.mat4[13],
    z: mvVector.x * pMatrix.mat4[2] + mvVector.y * pMatrix.mat4[6] + mvVector.z * pMatrix.mat4[10] + pMatrix.mat4[14]
  };
  
  // 转换为屏幕坐标
  const screenX = ((projected.x / projected.z) + 1) * 0.5 * p.width;
  const screenY = ((-projected.y / projected.z) + 1) * 0.5 * p.height;
  
  return { x: screenX, y: screenY };
}

export function screenToWorld(p: p5, screenX: number, screenY: number, worldZ: number = 0): { x: number; y: number } {
  const mvMatrix = (p as any)._renderer.uMVMatrix.copy();
  const pMatrix = (p as any)._renderer.uPMatrix.copy();
  
  const ndcX = (screenX / p.width) * 2 - 1;
  const ndcY = -(screenY / p.height) * 2 + 1;
  
  const rayClip = p.createVector(ndcX, ndcY, -1.0);
  const rayEye = p.createVector(
    rayClip.x / pMatrix.mat4[0],
    rayClip.y / pMatrix.mat4[5],
    rayClip.z
  );
  
  const worldX = rayEye.x - mvMatrix.mat4[12];
  const worldY = rayEye.y - mvMatrix.mat4[13];
  
  return { x: worldX, y: worldY };
}

export function getScaleFactor(p: p5, baseZ: number = 600): number {
  const mvMatrix = (p as any)._renderer.uMVMatrix;
  const currentZ = mvMatrix.mat4[14];
  
  return baseZ / Math.max(currentZ, 0.1);
} 