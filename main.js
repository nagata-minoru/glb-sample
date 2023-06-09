import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { getCylinderBounding, createBoundingCylinderMesh } from "./cylinder_bounding.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

(async () => {
  let scene, camera, renderer, texturedCube, loadedModel, gridHelper, axesHelper, light, ambient;

  let boundingCylinder;
  let boundingCylinderHelper;
  let modelGroup;
  let controls;

  /**
   * シーンを初期化します。
   * シーン、カメラ、レンダラー、テクスチャ付きキューブ、モデル、バウンディングボックスヘルパーを作成し、シーンに追加します。
   */
  const initializeScene = async () => {
    scene = new THREE.Scene();
    camera = createCamera();
    renderer = createRenderer();
    renderer.setClearColor(0xcfcfcf);
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

    controls = new OrbitControls(camera, renderer.domElement);

    gridHelper = new THREE.GridHelper(200, 500);
    scene.add(gridHelper);
    axesHelper = new THREE.AxesHelper(1000);
    scene.add(axesHelper);

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 100, 30);
    scene.add(light);

    ambient = new THREE.AmbientLight(0x404040, 0.9);
    scene.add(ambient);
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
      loader.load(
        "./ennchuBaoundingBox.glb",
        (object) => resolve(object.scene),
        undefined,
        (error) => console.log(error)
      )
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
    modelGroup.rotation.x += 0.001;
    modelGroup.rotation.y += 0.001;
    modelGroup.rotation.z += 0.001;
  };

  window.onresize = handleResize;

  await initializeScene();
  animate();
})();
