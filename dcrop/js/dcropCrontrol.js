let dcropController = {};

//AWS
//dcropController.controlUrl = "http://3.112.48.95:8080/execute?";
//AWS API
dcropController.controlUrl = "https://p2qpoo9rz5.execute-api.ap-northeast-1.amazonaws.com/alpha/execute?";
//LOCAL
//dcropController.controlUrl = "http://localhost:8080/execute?";

dcropController.makeRequest = function (method, url, data=null, callback=function(error, result){}) {
    const Http = new XMLHttpRequest();
    Http.onreadystatechange = (e) => {
        if (Http.readyState == 4 && Http.status == 200) {
            if (Http.responseText) {
                callback(null, Http.responseText)
                return
            }
        }
        if (Http.readyState == 4 && Http.status == 201) {
            if (Http.responseText) {
                callback(Http.responseText, null)
                return
            }
        }
        callback(null, null)
    }
    Http.open(method, url);
    if (data){
        Http.send(JSON.stringify(data));
    }else{
        Http.send();
    }
}

var record = false;
var recordedChunks = [];
dcropController.restartStream = function (dcropid) {
    // if (dcropid) {
    //     dcropid = String(dcropid).replace('cronos-dcrop@', '');
    // }
    // var cmd = `${dcropController.controlUrl}command=restartStream&dcropid=${dcropid}`;
    // console.log(`リスタートストリームします。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    // dcropController.makeRequest('POST', cmd, {});

    if (!record){
        recordedChunks = [];

        // const mediaStreamConstraints = {
        //     video: true
        // };
          
        // const localVideo = document.querySelector("#remote-video");
          
        // function gotLocalMediaStream(mediaStream) {
        //     const localStream = mediaStream;
        //     var options = { mimeType: "video/webm; codecs=vp9" };
        //     mediaRecorder = new MediaRecorder(localStream, options);
            
        //     mediaRecorder.ondataavailable = handleDataAvailable;
        //     mediaRecorder.start(1000);
            
        //     function handleDataAvailable(event) {
        //         console.log("data available: event.data.type=" + event.data.type + " size=" + event.data.size);
        //         if (event.data && event.data.size > 0) {
        //             recordedChunks.push(event.data);
        //             // console.log(recordedChunks);
        //             // download();
        //         } else {
        //             // ...
        //         }
        //     }
        // }
          
        // function handleLocalMediaStreamError(error) {
        //   console.log("navigator.getUserMedia error: ", error);
        // }

        // navigator.mediaDevices
        //   .getDisplayMedia(mediaStreamConstraints)
        //   .then(gotLocalMediaStream)
        //   .catch(handleLocalMediaStreamError);
            
        var canvas = document.querySelector('#remote-video');

        // Optional frames per second argument.
        var stream = canvas.captureStream();
        
        console.log(stream);
        var options = { mimeType: "video/webm; codecs=vp9" };
        mediaRecorder = new MediaRecorder(stream, options);
        
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(1000);
        
        function handleDataAvailable(event) {
          console.log("data available: event.data.type=" + event.data.type + " size=" + event.data.size);
          if (event.data && event.data.size > 0) {
            recordedChunks.push(event.data);
            // console.log(recordedChunks);
            // download();
          } else {
            // ...
          }
        }

        record = true;
    }
    else {
        console.log("stopping");
        mediaRecorder.stop();

        var blob = new Blob(recordedChunks, {
        type: "video/webm"
        });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "test.webm";
        a.click();
        window.URL.revokeObjectURL(url);

        record = false;
    }
  }

dcropController.exposureUp = function (dcropid) {
    if (dcropid) {
        dcropid = String(dcropid).replace('cronos-dcrop@', '');
    }
    var cmd = `${dcropController.controlUrl}command=exposureUp&dcropid=${dcropid}`;
    console.log(`露出を調整してます。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    dcropController.makeRequest('GET', cmd, null, function(error, result){
        if(result){
            result = JSON.parse(result);
            if(result.commandOutput){
                exposure = document.getElementById('exposure');
                exposure.innerText = result.commandOutput;
            }
        }
    });
}

dcropController.exposureDown = function (dcropid) {
    if (dcropid) {
        dcropid = String(dcropid).replace('cronos-dcrop@', '');
    }
    var cmd = `${dcropController.controlUrl}command=exposureDown&dcropid=${dcropid}`;
    console.log(`露出を調整してます。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    dcropController.makeRequest('GET', cmd, null, function(error, result){
        if(result){
            result = JSON.parse(result);
            if(result.commandOutput){
                exposure = document.getElementById('exposure');
                exposure.innerText = result.commandOutput;
            }
        }
    });
}

dcropController.brightnessUp = function (dcropid) {
    if (dcropid) {
        dcropid = String(dcropid).replace('cronos-dcrop@', '');
    }
    var cmd = `${dcropController.controlUrl}command=brightnessUp&dcropid=${dcropid}`;
    console.log(`明るさを調整してます。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    dcropController.makeRequest('GET', cmd, null, function(error, result){
        if(result){
            result = JSON.parse(result);
            if(result.commandOutput){
                brightness = document.getElementById('brightness');
                brightness.innerText = result.commandOutput;
            }
        }
    });
}

dcropController.brightnessDown = function (dcropid) {
    if (dcropid) {
        dcropid = String(dcropid).replace('cronos-dcrop@', '');
    }
    var cmd = `${dcropController.controlUrl}command=brightnessDown&dcropid=${dcropid}`;
    console.log(`明るさを調整してます。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    dcropController.makeRequest('GET', cmd, null, function(error, result){
        if(result){
            result = JSON.parse(result);
            if(result.commandOutput){
                brightness = document.getElementById('brightness');
                brightness.innerText = result.commandOutput;
            }
        }
    });
}

dcropController.contrastUp = function (dcropid) {
    if (dcropid) {
        dcropid = String(dcropid).replace('cronos-dcrop@', '');
    }
    var cmd = `${dcropController.controlUrl}command=contrastUp&dcropid=${dcropid}`;
    console.log(`コントラストを調整してます。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    dcropController.makeRequest('GET', cmd, null, function(error, result){
        if(result){
            result = JSON.parse(result);
            if(result.commandOutput){
                contrast = document.getElementById('contrast');
                contrast.innerText = result.commandOutput;
            }
        }
    });
}

dcropController.contrastDown = function (dcropid) {
    if (dcropid) {
        dcropid = String(dcropid).replace('cronos-dcrop@', '');
    }
    var cmd = `${dcropController.controlUrl}command=contrastDown&dcropid=${dcropid}`;
    console.log(`コントラストを調整してます。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    dcropController.makeRequest('GET', cmd, null, function(error, result){
        if(result){
            result = JSON.parse(result);
            if(result.commandOutput){
                contrast = document.getElementById('contrast');
                contrast.innerText = result.commandOutput;
            }
        }
    });
}

dcropController.getContrast = function (dcropid) {
    if (dcropid) {
        dcropid = String(dcropid).replace('cronos-dcrop@', '');
    }
    var cmd = `${dcropController.controlUrl}command=getContrast&dcropid=${dcropid}`;
    console.log(`コントラストを取得してます。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    dcropController.makeRequest('GET', cmd, null, function(error, result){
        if(result){
            result = JSON.parse(result);
            if(result.commandOutput){
                contrast = document.getElementById('contrast');
                contrast.innerText = result.commandOutput;
            }
        }
    });
}

dcropController.getBrightness = function (dcropid) {
    if (dcropid) {
        dcropid = String(dcropid).replace('cronos-dcrop@', '');
    }
    var cmd = `${dcropController.controlUrl}command=getBrightness&dcropid=${dcropid}`;
    console.log(`明るさを取得してます。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    dcropController.makeRequest('GET', cmd, null, function(error, result){
        if(result){
            result = JSON.parse(result);
            if(result.commandOutput){
                brightness = document.getElementById('brightness');
                brightness.innerText = result.commandOutput;
            }
        }
    });
}

dcropController.getExposure = function (dcropid) {
    if (dcropid) {
        dcropid = String(dcropid).replace('cronos-dcrop@', '');
    }
    var cmd = `${dcropController.controlUrl}command=getExposure&dcropid=${dcropid}`;
    console.log(`露出を取得してます。機械制御サーバーIP：${dcropController.controlUrl} ターゲット：${dcropid}`);
    dcropController.makeRequest('GET', cmd, null, function(error, result){
        if(result){
            result = JSON.parse(result);
            if(result.commandOutput){
                exposure = document.getElementById('exposure');
                exposure.innerText = result.commandOutput;
            }
        }
    });
}

function switchAdjustmentsMenu() {
    let popup = document.getElementById("cameraAdjustmentsMenu");
    if (popup.style.display === "block") {
        popup.style.display = "";
    } else {
        popup.style.display = "block";
    }
}