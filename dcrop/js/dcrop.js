let isControlActive = false;
let signalingServer = 'Ayame'
let connected_Ayame = false;
let connected_Cronos = false;
let isStarted = false;

/* 9/24 1.サーバー切り替え処理追加 Start */
//接続先URL保持
let connectUrl = signalingUrl;

//接続確認の終了フラグFの間、再帰で接続確認する。
let checkState = false;
/* 9/24 1.サーバー切り替え処理追加 End */

const options = Ayame.defaultOptions;
const cronosOptions = cronosAyame.defaultOptions;
options.clientId = clientId ? clientId : options.clientId;
cronosOptions.clientId = clientId ? clientId : cronosOptions.clientId;
if (signalingKey) {
  options.signalingKey = signalingKey;
  cronosOptions.signalingKey = signalingKey;
}
options.video.direction = 'recvonly';
options.audio.direction = 'recvonly';
cronosOptions.video.direction = 'recvonly';
cronosOptions.audio.direction = 'recvonly';
let remoteVideo = null;
let connAyame;
let connCronos;
const disconnect_Ayame = () => {
  if (connAyame) {
    connAyame.disconnect();
  }
  console.log("ページ再読込(AyameLabo)");
}
const disconnect_Cronos = () => {
  if (connCronos) {
    connCronos.disconnect();
  }
  console.log("ページ再読込(CronosAyame)");
}
const startConn_Ayame = async () => {
  await sleep(500);
  options.video.codec = videoCodec;
  cronosOptions.video.codec = videoCodec;
  console.log(`desired videoCodec:${videoCodec}`);
  await sleep(500);

  connAyame = Ayame.connection(signalingUrl, roomId, options, true);
  connAyame.on('connect', (e) => {
    signalingServer = 'Ayame';
    connected_Ayame = true;
    var restartStreamButton = document.getElementById("restartStreamButton");
    restartStreamButton.style.visibility = "hidden";
    console.log("connect Ayame-Labo");
  });  
  connAyame.on('open', async (e) => {
    //接続後に明るさ・露出・コントラストの数字を取得して表示させます
    dcropController.getExposure(roomId);
    dcropController.getBrightness(roomId);
    dcropController.getContrast(roomId);
  });
  connAyame.on('disconnect', (e) => {
    //remoteVideo.srcObject = null;
    remoteVideo.pause();
    if (signalingServer === 'Ayame' && connected_Ayame) {
      connected_Ayame = false;
      window.location.reload(1);
    }
  });

  connAyame.on('addstream', (e) => {
    createVideoIfNotExistent();
    remoteVideo.srcObject = e.stream;
  });

  connAyame.connect(null);
  await sleep(1000);
};
const startConn_cronosAyame = async () => {
  await sleep(500);
  options.video.codec = videoCodec;
  cronosOptions.video.codec = videoCodec;
  console.log(`desired videoCodec:${videoCodec}`);
  await sleep(500);

  connCronos = cronosAyame.connection(signalingUrlCronos, roomId, cronosOptions, true);
  console.log("fromIframe >> RoomId = " + roomId);
  connCronos.on('connect', (e) => {
    signalingServer = 'Cronos';
    connected_Cronos = true;
    var restartStreamButton = document.getElementById("restartStreamButton");
    restartStreamButton.style.visibility = "hidden";
    console.log("connect Cronos-Ayame");
  });
  connCronos.on('open', async (e) => {
    //接続後に明るさ・露出・コントラストの数字を取得して表示させます
    dcropController.getExposure(roomId);
    dcropController.getBrightness(roomId);
    dcropController.getContrast(roomId);
  });
  connCronos.on('disconnect', (e) => {
    //remoteVideo.srcObject = null;
    remoteVideo.pause();
    if (signalingServer === 'Cronos' && connected_Cronos) {
      connected_Cronos = false;
      window.location.reload(1);
    }
  });

  connCronos.on('addstream', (e) => {
    createVideoIfNotExistent();
    remoteVideo.srcObject = e.stream;
  });

  connCronos.connect(null);
  await sleep(1000);
};
document.querySelector("#roomIdInput").value = roomId;
let lblCameraName = document.getElementById("cameraName");
let cameraName = roomId;
cameraName = cameraName.replace("cronos-dcrop@", "");
lblCameraName.innerHTML = cameraName;
logger.logServerId = cameraName;

document.querySelector("#clientIdInput").value = options.clientId;

// フルスクリーンチェンジイベント
document.addEventListener("fullscreenchange", ()=> {
  fullScreenChange();
});
document.addEventListener("webkitfullscreenchange", ()=> {
  fullScreenChange();
});
document.addEventListener("mozfullscreenchange", ()=> {
  fullScreenChange();
});
document.addEventListener("MSFullscreenChange", ()=> {
  fullScreenChange();
});

// controlクラスにonMouseOver、onMouseOutイベントを追加
controls = document.getElementsByClassName("control");
for (var i = 0; i < controls.length; i++) {
  control = controls[i];
  control.onmouseover = function () {
    showControls();
    isControlActive = true;
  }
  control.onmouseout = function () {
    isControlActive = false;
  }
}

window.onload = function () {
  /* 9/24 2.サーバー切り替え処理追加 Start */
  ConnectTest();

  /* 9/24 2.サーバー切り替え処理追加 End */
  start();
}

/* 9/24 3.サーバー切り替え処理追加 Start */
//リロードだとconnectUrlの変更を保持できなかったので
//再帰処理ができるように新しい関数を定義
const ConnectTest =  async () => {

  //websocket接続開始
  console.log("接続確認開始");
  sock = new WebSocket(connectUrl);
  
  //WebSocket による接続が開いたときに発生
  sock.addEventListener('open',function(e){

    console.log("接続成功");
    checkState = true;
    sock.close();        
  });

  // WebSocket による接続が閉じたときに発生
  sock.addEventListener('close',function(e){

    if(checkState){
      if(connectUrl === signalingUrl){
        startConn_Ayame();
        console.log("本番接続：Ayamae");
      }else if(connectUrl === signalingUrlCronos){
        startConn_cronosAyame();
        console.log("本番接続：Cronos-Ayamae");
      }else{
        console.log("接続先なし");
      }
    }else{
      ConnectTest();
    }
    

  });

  //例外が発生したとき
  sock.addEventListener('error',function(e){
    
    if (connectUrl === signalingUrl){
      //Ayameに接続失敗
      console.log("接続失敗：Ayame");
      connectUrl = signalingUrlCronos;

    }else{
      //Cronos、Ayameともに接続失敗　処理終了の準備
      console.log("接続失敗：Ayame,Cronos");
      connectUrl = '';
      checkState = true;
    }
  });
}

/* 9/24 3.サーバー切り替え処理追加 End */

const sleep = ms => new Promise(resolve =>
  setTimeout(resolve, ms)
);

const start = async () => {
  if (!isStarted) {
    doWorkAsync();
  }
  isStarted = true;
}

async function doWorkAsync() {
  var restartStreamButton = document.getElementById("restartStreamButton");
  restartStreamButton.style.visibility = "visible";
  while (true) {
    await sleep(30000);
    if (!connected_Ayame && !connected_Cronos) {
     console.log("retrying to connect");
     window.location.reload(1);
    }

  }
}

function createVideoIfNotExistent() {
  if (remoteVideo == null) {
    var video = document.createElement("video");
    video.style.visibility = "visible";
    video.id = "remote-video";
    video.autoplay = "true";
    video.muted = "true";
    video.style.objectFit = "cover";
    // video.onmouseover = function () {
    //   showControls();
    // }
    video.onmouseleave = function () {
      hideControls();
    }
    video.onmousemove = function () {
      showControls();
      setTimeout(function(){
        if (!isControlActive) {
          hideControls();
        }
      }, 3000);
    }

    document.getElementById("videoContainer").appendChild(video);
    remoteVideo = document.querySelector('#remote-video');
  }
}

function showControls() {
  let controls = document.getElementsByClassName("control");
  for (var i = 0; i < controls.length; i++) {
    let control = controls[i];
    control.style.visibility = "visible";
  }

  // フルスクリーンの場合
  if (isFullScreen()) {
    document.getElementById("fullScreenControl").style.visibility = "hidden";
    document.getElementById("exitFullScreenControl").style.visibility = "visible";
  }
  else {
    document.getElementById("fullScreenControl").style.visibility = "visible";
    document.getElementById("exitFullScreenControl").style.visibility = "hidden";
  }
}

function hideControls() {
  let controls = document.getElementsByClassName("control");
  for (var i = 0; i < controls.length; i++) {
    let control = controls[i];
    control.style.visibility = "hidden";
  }
  let popup = document.getElementById("cameraAdjustmentsMenu");
  popup.style.display = "";
}

function switchAspect() {
  if (remoteVideo != null) {
    let icon = document.getElementById("aspectControl");
    if (remoteVideo.style.objectFit == "cover") {
      remoteVideo.style.objectFit = "unset";
      icon.innerHTML = '<i class="fas fa-expand noselect"></i>';
      console.log("aspect expand");
    } else {
      remoteVideo.style.objectFit = "cover";
      icon.innerHTML = '<i class="fas fa-compress noselect"></i>';
      console.log("aspect compress");
    }
  }
}

function muteUnmute() {
  if (remoteVideo != null) {
    let icon = document.getElementById("speakerControl");
    if (remoteVideo.muted === false) {
      remoteVideo.muted = true;
      icon.innerHTML = '<i class="fas fa-volume-mute noselect"></i>';
      console.log("volume mute");
    } else {
      remoteVideo.muted = false;
      icon.innerHTML = '<i class="fas fa-volume-up noselect"></i>';
      console.log("volume up");
    }
  }
}

// function fullScreen() {
//   if (remoteVideo != null) {
//     openFullscreen(remoteVideo);
//   }
// }

// function openFullscreen(myVideo) {
//   var elem = myVideo
//   console.log(elem)
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//   } else if (elem.mozRequestFullScreen) { /* Firefox */
//     elem.mozRequestFullScreen();
//   } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) { /* IE/Edge */
//     elem.msRequestFullscreen();
//   }
// }

// フルスクリーン表示
function fullScreen() {
  // Chrome & Firefox v64以降
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  // Firefox v63以前
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  // Safari & Edge & Chrome v68以前
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  // IE11
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
}

// フルスクリーン解除
function exitFullScreen() {
  fullScreen();

  // Chrome & Firefox v64以降
  if (document.exitFullscreen) {
    document.exitFullscreen();
  // Firefox v63以前
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  // Safari & Edge & Chrome v44以前
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  // IE11
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// フルスクリーンチェンジ
function fullScreenChange() {
  var mode = window.parent.document.getElementById("videoMode");
  var name = window.parent.document.getElementById("fullCameraName");
  if( window.document.fullscreenElement ){
    mode.value = "1";
    name.value = roomId;
    console.log("フルスクリーン表示");
  }
  else{
    mode.value = "0";
    name.value = "";
    console.log("フルスクリーン解除");
  }
}

// フルスクリーンチェック
function isFullScreen() {
  var mode = window.parent.document.getElementById("videoMode");
  var name = window.parent.document.getElementById("fullCameraName");
  if (mode.value == "1" && name.value == roomId) {
    return true;
  }
  else {
    return false;
  }
}