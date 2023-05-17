import * as THREE from "three";

class CylinderBounding {
  constructor(center, radius, height, direction, position) {
    this.center = center;    // 円柱の中心点
    this.radius = radius;    // 円柱の半径
    this.height = height;    // 円柱の高さ
    this.direction = direction;  // 円柱の向き
    this.position = position;  // 円柱の位置
  }
}

// THREE.GroupからCylinderBoundingを得る関数
function getCylinderBounding(group) {
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
  let center = new THREE.Vector3(
    (minX + maxX) / 2,
    (minY + maxY) / 2,
    (minZ + maxZ) / 2
  );

  // 円柱の高さを計算
  let height = maxY - minY;

  // 円柱の半径を計算
  let radius = Math.max(maxX - minX, maxZ - minZ) / 2;

  // 円柱の向きを設定（Y軸方向を基本とする）
  let direction = new THREE.Vector3(0, 1, 0);

  // let position = group.position;
  // console.log(group);
  let position = {
    x: group.position.x + center.x,
    y: group.position.y + center.y,
    z: group.position.z + center.z
  }
  // let position = center;

  return new CylinderBounding(center, radius, height, direction, position);
}

const updateCylinder = (group, cylinder) => {
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
  let center = new THREE.Vector3(
    (minX + maxX) / 2,
    (minY + maxY) / 2,
    (minZ + maxZ) / 2
  );

  // 円柱の高さを計算
  let height = maxY - minY;

  // 円柱の半径を計算
  let radius = Math.max(maxX - minX, maxZ - minZ) / 2;

  // 円柱の向きを設定（Y軸方向を基本とする）
  let direction = new THREE.Vector3(0, 1, 0);

  // let position = group.position;
  // console.log(group);
  let position = {
    x: group.position.x + center.x,
    y: group.position.y + center.y,
    z: group.position.z + center.z
  }

  cylinder.center = center;
  cylinder.height = height;
  cylinder.position.x = position.x;
  cylinder.position.y = position.y;
  cylinder.position.z = position.z;
}

/**
 * 円柱バウンディングを描画する関数
 * @param {CylinderBounding} cylinderBounding 描画する円柱バウンディング
 * @param {THREE.Scene} scene 描画するシーン
 */
function drawCylinderBounding(cylinderBounding, scene) {
  // 円柱のジオメトリを作成します。半径、高さ、ラジアン分割数を指定します。
  const geometry = new THREE.CylinderGeometry(
    cylinderBounding.radius, cylinderBounding.radius, cylinderBounding.height, 32
  );

  // ワイヤーフレームスタイルのマテリアルを作成します。
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

  // ジオメトリとマテリアルからメッシュ（円柱）を作成します。
  const cylinder = new THREE.Mesh(geometry, material);

  // 円柱をシーンに追加します。
  scene.add(cylinder);

  // 円柱の位置を円柱バウンディングの中心に設定します。
  // cylinder.position.copy(cylinderBounding.center);
  cylinder.position.x = cylinderBounding.position.x;
  cylinder.position.y = cylinderBounding.position.y;
  cylinder.position.z = cylinderBounding.position.z;

  // 円柱の向きを円柱バウンディングの方向に設定します。
  // cylinder.lookAt(cylinderBounding.direction);
  // cylinder.lookAt(cylinderBounding.direction.clone().add(cylinderBounding.center))

  return cylinder;
}

export { CylinderBounding, getCylinderBounding, drawCylinderBounding, updateCylinder };
