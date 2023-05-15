import * as THREE from 'three';

(() => {
  // シーン、カメラ、レンダラー、キューブの宣言
  let scene, camera, renderer, cube;

  // 初期化関数
  const init = () => {
    // 新しい3Dシーンを作成
    scene = new THREE.Scene();

    // 新しい透視投影カメラを作成
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 新しいWebGLレンダラーを作成
    renderer = new THREE.WebGLRenderer();

    // レンダラーのサイズをウィンドウのサイズに設定
    renderer.setSize(window.innerWidth, window.innerHeight);

    // レンダラーをDOMに追加
    document.body.appendChild(renderer.domElement);

    // キューブのジオメトリ（形状）を作成
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    // テクスチャをロード
    let path = document.location.pathname;
    path = path.substring(0, path.lastIndexOf('/') + 1);
    let baseUrl = document.location.origin + path;
    const texture = new THREE.TextureLoader().load(`${baseUrl}textures/wall.jpg`);
        // テクスチャを使用したマテリアルを作成
    const material = new THREE.MeshBasicMaterial({ map: texture });
    // ジオメトリとマテリアルからメッシュ（実際に描画される3Dオブジェクト）を作成
    cube = new THREE.Mesh(geometry, material);
    // メッシュをシーンに追加
    scene.add(cube);

    // カメラをZ軸上に移動（キューブを適切に見るため）
    camera.position.z = 5;
  }

  // ウィンドウがリサイズされた時のイベントハンドラ
  window.onresize = () => {
    // カメラのアスペクト比を更新
    camera.aspect = window.innerWidth / window.innerHeight;
    // カメラの投影行列を更新
    camera.updateProjectionMatrix();
    // レンダラーのサイズをウィンドウのサイズに再設定
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 初期化関数を呼び出し
  init();

  // アニメーションループ
  (function animate() {
    // 次のフレームでanimate関数を再呼び出し
    requestAnimationFrame(animate);
    // キューブをX軸とY軸周りに少しずつ回転
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // シーンをレンダリング（描画）
    renderer.render(scene, camera);
  })();
})();
