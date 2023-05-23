import * as THREE from "three";

/**
 * 円柱バウンディングクラス。
 * このクラスは、3次元オブジェクトを包含する円柱の表現を提供します。
 *
 * @class
 * @property {THREE.Vector3} center - 円柱の中心点
 * @property {number} radius - 円柱の半径
 * @property {number} height - 円柱の高さ
 * @property {THREE.Vector3} direction - 円柱の向き
 * @property {THREE.Vector3} position - 円柱の位置
 */
class CylinderBounding {
  constructor(center, radius, height, direction, position) {
    this.center = center;    // 円柱の中心点
    this.radius = radius;    // 円柱の半径
    this.height = height;    // 円柱の高さ
    this.direction = direction;  // 円柱の向き
    this.position = position;  // 円柱の位置
  }
}

/**
 * 与えられたグループ内の全てのメッシュに対する最小のバウンディング円柱を計算します。
 *
 * @param {THREE.Group} group - バウンディング円柱を計算する対象のメッシュ群が含まれるグループ
 * @returns {CylinderBounding} 計算された最小のバウンディング円柱
 */
export function getCylinderBounding(group) {
  let minX, minY, minZ, maxX, maxY, maxZ;

  group.traverse((object) => {
    if (object.isMesh) {
      object.geometry.computeBoundingBox();
      let boundingBox = object.geometry.boundingBox;
      minX = minX !== undefined ? Math.min(minX, boundingBox.min.x) : boundingBox.min.x;
      minY = minY !== undefined ? Math.min(minY, boundingBox.min.y) : boundingBox.min.y;
      minZ = minZ !== undefined ? Math.min(minZ, boundingBox.min.z) : boundingBox.min.z;
      maxX = maxX !== undefined ? Math.max(maxX, boundingBox.max.x) : boundingBox.max.x;
      maxY = maxY !== undefined ? Math.max(maxY, boundingBox.max.y) : boundingBox.max.y;
      maxZ = maxZ !== undefined ? Math.max(maxZ, boundingBox.max.z) : boundingBox.max.z;
    }
  });

  // 円柱の中心を計算
  const center = new THREE.Vector3(
    (minX + maxX) / 2,
    (minY + maxY) / 2,
    (minZ + maxZ) / 2
  );

  // 円柱の高さを計算
  const height = maxY - minY;

  // 円柱の半径を計算
  const radius = Math.max(maxX - minX, maxZ - minZ) / 2;

  // 円柱の向きを設定（Y軸方向を基本とする）
  const direction = new THREE.Vector3(0, 1, 0);

  const position = {
    x: group.position.x + center.x,
    y: group.position.y + center.y,
    z: group.position.z + center.z
  }

  return new CylinderBounding(center, radius, height, direction, position);
}

/**
 * 円柱形のバウンディングボックスを描画する関数
 * @param {CylinderBounding} cylinderBounding 描画する円柱形のバウンディングボックス
 * @returns {THREE.Mesh} バウンディングボックスを表現するメッシュオブジェクト
 */
export function createBoundingCylinderMesh(cylinderBounding) {
  // 円柱のジオメトリを作成します。半径、高さ、ラジアン分割数を指定します。
  const cylinderGeometry = new THREE.CylinderGeometry(
    cylinderBounding.radius, cylinderBounding.radius, cylinderBounding.height, 128
  );

  // ワイヤーフレームスタイルのマテリアルを作成します。ここでは色を赤に設定しています。
  const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

  // ジオメトリとマテリアルからメッシュ（円柱）を作成します。
  const boundingCylinderMesh = new THREE.Mesh(cylinderGeometry, wireframeMaterial);

  // 円柱の位置を円柱バウンディングの中心に設定します。
  boundingCylinderMesh.position.x = cylinderBounding.position.x;
  boundingCylinderMesh.position.y = cylinderBounding.position.y;
  boundingCylinderMesh.position.z = cylinderBounding.position.z;

  return boundingCylinderMesh;
}
