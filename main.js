import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { CylinderBounding, getCylinderBounding, drawCylinderBounding, updateCylinder } from './cylinder_bounding.js';

(async () => {
  let scene, camera, renderer, texturedCube, loadedModel, gridHelper, axesHelper;

  let foo;
  let bar;

  /**
   * シーンを初期化します。
   * シーン、カメラ、レンダラー、テクスチャ付きキューブ、モデル、バウンディングボックスヘルパーを作成し、シーンに追加します。
   */
  const initializeScene = async () => {
    scene = new THREE.Scene();
    camera = createCamera();
    renderer = createRenderer();
    document.body.appendChild(renderer.domElement);

    texturedCube = createTexturedCube();
    scene.add(texturedCube);

    loadedModel = await loadModel();

    boundingCylinder = getCylinderBounding(loadedModel);
    boundingCylinderHelper = createBoundingCylinderMesh(boundingCylinder, scene);

    modelGroup = new THREE.Group();
    modelGroup.add(loadedModel);
    modelGroup.add(boundingCylinderHelper);
    scene.add(modelGroup);

    camera.position.z = 7;

    camera.position.x = 0.5;
    camera.position.y = 3;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    gridHelper = new THREE.GridHelper(200, 200);
    scene.add(gridHelper);
    axesHelper = new THREE.AxesHelper(1000);
    scene.add(axesHelper);
  };

  /**
   * カメラを作成します。
   * @returns {THREE.PerspectiveCamera} 作成されたカメラ。
   */
  const createCamera = () => {
    return new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  };

  /**
   * レンダラーを作成します。
   * @returns {THREE.WebGLRenderer} 作成されたレンダラー。
   */
  const createRenderer = () => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
  };

  /**
   * テクスチャ付きのキューブを作成します。
   * @returns {THREE.Mesh} 作成されたテクスチャ付きキューブ。
   */
  const createTexturedCube = () => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const texture = new THREE.TextureLoader().load(`${getBaseUrl()}textures/wall.jpg`);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = -1.1;
    return cube;
  };

  /**
   * ベースURLを取得します。
   * @returns {string} ベースURL。
   */
  const getBaseUrl = () => {
    let path = document.location.pathname;
    path = path.substring(0, path.lastIndexOf("/") + 1);
    return document.location.origin + path;
  };

  /**
   * モデルをロードします。
   * @returns {Promise<THREE.Group>} ロードされたモデル。
   */
  const loadModel = async () => {
    const loader = new GLTFLoader();
    const model = await new Promise((resolve) =>
      loader.load("./scene.glb", (object) => resolve(object.scene), undefined, (error) => console.log(error))
    );
    model.position.x = 1.1;
    return model;
  };

  /**
   * ウィンドウがリサイズされたときに実行されます。
   * カメラとレンダラーのサイズを調整します。
   */
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  /**
   * アニメーションを実行します。
   * レンダリングループを開始し、オブジェクトをアニメーションさせ、シーンをレンダリングします。
   */
  const animate = () => {
    requestAnimationFrame(animate);
    animateObjects();
    renderer.render(scene, camera);
  };

  /**
   * オブジェクトをアニメーションさせます。
   * キューブとモデルを回転させ、バウンディングボックスヘルパーを更新します。
   */
  const animateObjects = () => {
    texturedCube.rotation.x -= 0.005;
    texturedCube.rotation.y += 0.005;
    modelGroup.rotation.x += 0.01;
    modelGroup.rotation.y += 0.01;
    modelGroup.rotation.z += 0.01;
  };

  window.onresize = handleResize;

  await initializeScene();
  animate();
})();
