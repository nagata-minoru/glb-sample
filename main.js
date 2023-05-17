import * as THREE from "three"; // Three.jsライブラリをインポートします。
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";

(async () => {
  // シーン、カメラ、レンダラー、キューブの宣言
  let scene, camera, renderer, cube;

  let loadedModel;

  /**
   * シーンの初期化
   */
  const init = async () => {
    // シーンを作成します。シーンはオブジェクトや光源を格納するコンテナです。
    scene = new THREE.Scene();

    // カメラを作成します。ここでは透視投影カメラを使用します。
    // 最初の引数は視野角(FOV)、次の引数はアスペクト比、最後の2つの引数はニアクリップとファークリップの平面です。
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // WebGLを使用したレンダラーを作成します。これによりシーンが描画されます。
    renderer = new THREE.WebGLRenderer();

    // レンダラーのサイズを現在のウィンドウのサイズに設定します。
    renderer.setSize(window.innerWidth, window.innerHeight);

    // renderer.setClearColor(0xefefef);

    // レンダラーをDOMに追加します。これにより描画結果が表示されます。
    document.body.appendChild(renderer.domElement);

    // キューブのジオメトリ（形状）を作成します。BoxGeometryは幅、高さ、奥行きを引数とします。
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    // テクスチャローダーを使用してテクスチャをロードします。テクスチャは画像を3Dオブジェクトにマッピングするために使用されます。
    let path = document.location.pathname;
    path = path.substring(0, path.lastIndexOf("/") + 1);
    let baseUrl = document.location.origin + path;
    const texture = new THREE.TextureLoader().load(`${baseUrl}textures/wall.jpg`);

    // マテリアルを作成します。マテリアルはオブジェクトの表面の見た目（色、光沢等）を定義します。
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // ジオメトリとマテリアルからメッシュ（実際に描画される3Dオブジェクト）を作成します。
    cube = new THREE.Mesh(geometry, material);

    cube.position.x = -1.1;

    // メッシュをシーンに追加します。
    scene.add(cube);

    const loader = new GLTFLoader();
    loadedModel = await new Promise((resolve) =>
      loader.load("./scene.glb", (object) => resolve(object.scene), undefined, (error) => console.log(error))
    );

    loadedModel.position.x = 1.1;
    scene.add(loadedModel);

    // カメラをZ軸上に移動（キューブを適切に見るため）
    camera.position.z = 7;
  };

  /**
   * ウィンドウがリサイズされた時のイベントハンドラ
   */
  const handleResize = () => {
    // ウィンドウサイズの変更に対応するためにカメラのアスペクト比を再設定します。
    camera.aspect = window.innerWidth / window.innerHeight;
    // カメラの投影行列を更新します。これはカメラの設定が変更された後に必要です。
    camera.updateProjectionMatrix();
    // レンダラーのサイズを新しいウィンドウのサイズに再設定します。
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  /**
   * アニメーションループ
   */
  const animate = () => {
    // requestAnimationFrameを使用してブラウザにアニメーションを行うことを要求します。次の描画の準備ができたらanimate関数を呼び出します。
    requestAnimationFrame(animate);

    // キューブの回転値を少しずつ増やしてアニメーションを作ります。
    cube.rotation.x -= 0.005;
    cube.rotation.y += 0.005;

    loadedModel.rotation.x += 0.01;
    loadedModel.rotation.y += 0.01;

    // シーンとカメラを渡して描画を実行します。
    renderer.render(scene, camera);
  };

  // ウィンドウのリサイズイベントにイベントハンドラを設定します。
  window.onresize = handleResize;

  // 初期化関数を呼び出してシーンをセットアップします。
  await init();

  // アニメーションループを開始します。
  animate();
})();
