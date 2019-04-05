
if (!hasMedia()) {
    alert("Error: Cannot access get user media API");
} else {
    const canvas = document.createElement('canvas');
    const img = document.querySelector('img');

    window.addEventListener('load', startup, false);
}

function hasMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function handleError(event) {
    console.log("Error");
}

function startup() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        //audio: true
    }).then(function(mediaStreamObject) {
        let video = document.querySelector('video');
        video.srcObject = mediaStreamObject;
        document.addEventListener('keydown', function(e) {
            if (e.keyCode == 13 && video != null) {
                takeScreenshot();
            }
        })
        video.onloadedmetadata = function(event) {
            video.play();
        };
    }).catch(handleError);
}

function takeScreenshot() {
    let video = document.querySelector('video');
    var img = document.getElementById('screenshotImage');
    var context;
    var width = video.offsetWidth, 
        height = video.offsetHeight;

    canvas = document.querySelector('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    img.src = canvas.toDataURL('image/png');
    document.body.appendChild(canvas);
}
