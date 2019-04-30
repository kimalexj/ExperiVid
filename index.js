if (!hasMedia()) {
    alert("Error: Cannot access get user media API");
} else {
    //window.addEventListener('load', startup, false);
    //window.addEventListener('load', handleSpeech(), false);
    document.addEventListener('click', function(e) {
        if (e.target.id == 'begin') {
            openFullscreen();
            startup();
            handleSpeech();
        } else if (e.target.id == 'redo') {
            handleRedo();
        } 
    });

    document.addEventListener('keydown', function(e) {
        if (e.keyCode == 27) {
            closeFullscreen();
        }
    });
}

function initiateProgram() {
    localStorage.setItem('user_name', document.getElementById('inputName').value);
    localStorage.setItem('session_id', Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
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

        // Delete this section later 
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
        var grammar = '#JSGF V1.0; grammar responses; public <responses> = click | next';
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        var recognition = new webkitSpeechRecognition();
        recognition.grammar = speechRecognitionList;

        // Function used to test user speech
        var userSaid = function(str, s) {
			return str.indexOf(s) > -1;
        }
        
        // Accuracy of the word
        var confidenceThreshold = 0.5;

        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.start();

        recognition.onresult = function(e) {
            // Check each result starting from the last one
            for (var i = e.resultIndex; i < e.results.length; ++i) {
                // If this is a final result
                if (e.results[i].isFinal) {
                    // If the result is equal to or greater than the required threshold
                    if (parseFloat(e.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
                        var str = e.results[i][0].transcript;
                        console.log('Recognised: ' + str);
                        if (userSaid(str, 'click')) {
                            takeScreenshot();
                            openModal();
                        } else if (userSaid(str, 'next')) {
                            document.getElementById('download').click();
                        }
                    }
                }
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

// Handles next picture updating
var pictureNumber = 1;

// Handle Download click
document.addEventListener('click', function(e) {
    if (e.target.id == 'download') {
        var a = document.createElement('a');
        a.href = localStorage.getItem('image_context');

        // Unique id's
        a.download = localStorage.getItem('user_name') + '-' + localStorage.getItem('session_id') + '-' + pictureNumber + '.jpg'
        console.log(a.download);
        a.click();
        document.getElementById('activateModal').click();

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
});

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
    localStorage.setItem('image_context', image);
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
