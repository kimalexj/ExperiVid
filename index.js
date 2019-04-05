
if (!hasMedia()) {
    alert("Error: Cannot access get user media API");
} else {
    const canvas = document.createElement('canvas');
    const img = document.querySelector('img');

    window.addEventListener('load', startup, false);

    document.addEventListener('keydown', function(e) {
        if (e.keyCode ===  13 && webcam !== null) {
            
        }
    });
}

function hasMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function handleError(event) {
    console.log("Error");
}

function startup() {
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(function(mediaStreamObject) {
        let video = document.querySelector('video');
        video.srcObject = mediaStreamObject;
        video.onloadedmetadata = function(event) {
            video.play();
        };
    }).catch(handleError);
}
