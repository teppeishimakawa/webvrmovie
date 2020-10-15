


  var width = window.innerWidth*0.7;
  var height = window.innerHeight*0.3;

  //scene

  var scene = new THREE.Scene();

  //mesh

  //SphereGeometry(radius : Float, widthSegments : Integer,
  //heightSegments : Integer, phiStart : Float, phiLength : Float,
  //thetaStart : Float, thetaLength : Float)
  var geometry = new THREE.SphereGeometry( 5, 60, 40 );
  //x軸マイナスにして、球の裏側に映像表示
    geometry.scale( -1, 1, 1 );

  var video = document.createElement( 'video' );
  video.width = 640;
  video.height = 360;
  video.autoplay = true;
  video.loop = true;
  video.src = "./test.mp4";
  //playsinline 属性指定により、全画面で動画が再生されてしまうのを防ぐ
  video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
  video.setAttribute( 'playsinline', 'playsinline' );

  var texture = new THREE.VideoTexture( video );
  texture.minFilter = THREE.LinearFilter;

  var material = new THREE.MeshBasicMaterial( {
       map: texture
  } );

  mesh = new THREE.Mesh( geometry, material );
  //mesh.rotation.z=8* Math.PI/180;
  scene.add( mesh );

  //camera

  var camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
  camera.position.set(0,0,0.1);
  camera.lookAt(mesh.position);

  //helper

  //var axis = new THREE.AxesHelper(1000);
  //axis.position.set(0,0,0);
  //scene.add(axis);

  //render

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width,height);
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('stage').appendChild(renderer.domElement);
  renderer.render(scene,camera);



  //pc control

  var controls = new THREE.OrbitControls(camera,renderer.domElement);
  controls.enableZoom=false;
    // 視点操作のイージングをONにする
  controls.enableDamping = true;
  // 視点操作のイージングの値
  controls.dampingFactor = 0.2;
  // 視点変更の速さ
  controls.rotateSpeed = 0.1;
  // パン操作禁止
  controls.noPan = true;



/////////////
const requestDeviceOrientationPermission = () => {
  if (
    DeviceOrientationEvent &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    // iOS 13+ の Safari
    // 許可を取得
    DeviceOrientationEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        // 許可を得られた場合、deviceorientationをイベントリスナーに追加
        window.addEventListener('deviceorientation', e => {
          // deviceorientationのイベント処理
        })
      } else {
        // 許可を得られなかった場合の処理
        console.log("disable...")
      }
    }).catch(console.error) // https通信でない場合などで許可を取得できなかった場合
  } else {
    // 上記以外のブラウザ
    console.log("disable browser...")
  }
}

// ボタンクリックでrequestDeviceOrientationPermission実行
const startButton = document.getElementById("start-button")
startButton.addEventListener('click', requestDeviceOrientationPermission, false)
//////////////







  //sp control
  // スマートフォンの場合はジャイロセンサーでの操作へ変更
window.addEventListener("deviceorientation", setOrientationControls, true);
// ジャイロセンサーで視点操作する
function setOrientationControls(e) {
  //スマートフォン以外で処理させない
  if (!e.alpha) {
    return;
  }
  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();
  window.removeEventListener("deviceorientation", setOrientationControls, true);
}


  function rend(){
    requestAnimationFrame(rend);
    mesh.rotation.y += 0.05 * Math.PI/180;
    //画面リサイズ対応
    window.addEventListener( 'resize', onWindowResize, false );
    renderer.render(scene,camera);
    controls.update();
  }
  rend();


  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

