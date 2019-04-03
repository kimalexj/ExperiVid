import React from 'react';
import {Component} from 'react';
import Webcam from 'react-webcam';

class Camera extends Component {

    constructor() {
        super();
        this.handlEnterPress = this.handleEnterPress.bind(this);
    }
    
    handleEnterPress(e) {
        if (e.keyCode === 13) {
            this.webcam.getScreenShot();
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleEnterPress);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleEnterPress);
    }

    render() {
        return (
            <div class="container">
                <Webcam
                    audio = {false}
                    height = {1000}
                    width = {1000}
                    screenshotFormat = "image/png"
                    screenShotQuality = {1}
                    imageSmoothing = {true}
                    minScreenshotWidth = {1080}
                    minScreenshotHeight = {860}
                />
            </div>
        )
    }
}

export default Camera;