
if (!hasMedia()) {
    alert("Error: Cannot access get user media API");
} else {
    const canvas = document.createElement('canvas');
    const img = document.querySelector('img');

    // This handles the image application
    var elementsArray = document.querySelectorAll(".btn");
    console.log(elementsArray);
    console.log(elementsArray.length);
    elementsArray.forEach(function(element) {
        element.addEventListener('input', function() {
            alert("click works");
        });
    });

    window.addEventListener('load', startup, false);
}

// Verifies the existence of media devices for use of video/audio
function hasMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function handleError(event) {
    console.log("Error");
}

// Asks for permission to use media devices and activates as such
// Also manages screenshots
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

// Function that handlees the screenshot appending to the canvas
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
