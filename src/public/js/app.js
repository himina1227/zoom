const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const cameras = devices.filter(device => device.kind === "videoinput");
        console.log(cameras);
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            camerasSelect.appendChild(option);
        })
    } catch (e) {
        console.log(e);
    }
}

async function getMedia() {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
           audio: true,
           video: true,
        });
        // console.log(myStream);
        myFace.srcObject = myStream;
    } catch (e) {
        console.log(e);
    }
}

function handleMuteClick() {
    myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    if (!muted) {
        muteBtn.innerText = "Unmute";
        muted = false;
    } else {
        muteBtn.innerText = "mute";
        muted = true;
    }
}

function handleCameraClick() {
    myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
    } else {
        cameraBtn.innertText = "Turn Camera On";
    }
}

getMedia();

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);