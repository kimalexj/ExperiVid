if (!hasMedia()) {
    alert("Error: Cannot access get user media API");
} else {
    window.addEventListener('load', startup, false);
    document.addEventListener('click', function(e) {
        if (e.target.id == 'begin') {
            openFullscreen();
        } else if (e.target.id == 'redo') {
            handleRedo();
        } else if (e.target.id == 'continue') {
            handleContinue();
        }
    })

    document.addEventListener('keydown', function(e) {
        if (e.keyCode == 27) {
            closeFullscreen();
        }
    });
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

        // Delete this section later (THIS CREATES THE REPEAT)
        document.addEventListener('keydown', function(e) {
            if (e.keyCode == 13 && video != null) {
                takeScreenshot();
                openModal();
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
            } else if (e.results[0][0].transcript == 'done') {
                updateImage();
                openFullscreen();
            }
        };

        recognition.onerror = function(e) {
            recognition.stop();
        }
    }
}

function handleRedo() {
    openFullscreen();
}

function handleContinue() {
    updateImage();
}

var pictureNumber = 1;
function updateImage() {
    let helperImage = document.getElementById('helperImage')
    let currImage = document.getElementById('selectedImage');
    let modalImage = document.getElementById('modalImage');
    pictureNumber++;
    let picturePath = './images/' + pictureNumber + '.png';
    currImage.src = picturePath;
    modalImage.src = picturePath;
    helperImage.src = picturePath;
    openFullscreen();
}

// Opens Modal upon taking a screenshot
function openModal() {
    closeFullscreen();
    document.getElementById('activateModal').click();
}

// Opens fullscreen view of webcam
function openFullscreen() {
    var elem = document.getElementById("videoContainer");
    elem.style.display = "";
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

// Closes fullscreen view of webcam
function closeFullscreen() {
    if (document.fullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    var elem = document.getElementById("videoContainer");
    elem.style.display = "none";
  }

// Function that handles the screenshot appending to the canvas
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
    img.style.transform = "scaleX(-1)";

    var image = canvas.toDataURL('image');
    
    document.addEventListener('click', function(e) {
        if (e.target.id == 'download') {
            var a = document.createElement('a');
            a.href = image;

            // Unique id's
            a.download = 'screenshot.jpg'
            a.click();
            document.getElementById('continue').click();
            document.getElementById('activateModal').click();
        }
    });
}

