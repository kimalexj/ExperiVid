
if (!hasMedia()) {
    alert("Error: Cannot access get user media API");
} else {
    window.addEventListener('load', startup, false);
    document.addEventListener('click', function(e) {
        if (e.target.id == 'special') {
            openModal();
        }
    })
}

// Verifies the existence of media devices for use of video/audio
function hasMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function handleError(event) {
    console.log("Error");
}

// Media device startup
function startup() {
    navigator.mediaDevices.getUserMedia({
        video: true
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

function handleSpeech() {
    // Receiving speech command
    if (window.hasOwnProperty('webkitSpeechRecognition')) {

        var recognition = new webkitSpeechRecognition();

        recognition.lang = "en-US";
        recognition.start();

        recognition.onresult = function(e) {
            if (e.results[0][0].transcript == 'take') {
                takeScreenshot();
                openModal();
            }
        };

        recognition.onerror = function(e) {
            recognition.stop();
        }
    }
}

// Opens Modal upon taking a screenshot
function openModal() {
    let modal = document.getElementById('activateModal');
    modal.setAttribute('data-toggle', 'modal');
}

// Function that handlees the screenshot appending to the canvas
function takeScreenshot() {
    let video = document.querySelector('video');
    var img = document.getElementById('screenshotImage');
    var context;
    var width = video.offsetWidth, 
        height = video.offsetHeight;

    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    img.src = canvas.toDataURL('image/png');

    var image = canvas.toDataURL('image');
    document.addEventListener('keydown', function(e) {
        if (e.keyCode == 16) {
            var a = document.createElement('a');
            a.href = image;
            a.download = 'screenshot.jpg'
            a.click();
        }
    });
}
