import * as THREE from 'three';

(() => {
  // シーン、カメラ、レンダラー、キューブの宣言
  let scene, camera, renderer, cube;

  /**
   * シーンの初期化
   */
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    let path = document.location.pathname;
    path = path.substring(0, path.lastIndexOf('/') + 1);
    let baseUrl = document.location.origin + path;
    const texture = new THREE.TextureLoader().load(`${baseUrl}textures/wall.jpg`);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
  }

  /**
   * ウィンドウがリサイズされた時のイベントハンドラ
   */
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * アニメーションループ
   */
  const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  // イベントハンドラの設定
  window.onresize = handleResize;

  // 初期化とアニメーションの開始
  init();
  animate();
})();
