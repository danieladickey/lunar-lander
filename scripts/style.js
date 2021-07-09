let winW, winH;

function fitToScreen() {
    winH = window.innerHeight; // get width of window
    winW = window.innerWidth; // get height of window
    let gameDiv = document.getElementById("game");
    let p = .9;


    // let canvas = document.getElementById("id-canvas");
    // // if window smaller than 600 make everything 600, that's the min required
    // if (winW < 600 || winH < 600) {
    //     // canvas.width = 600;
    //     // canvas.height = 600;
    //     gameDiv.style.height = 600 + "px";
    //     gameDiv.style.width = 600 + "px";
    // }
    //
    // // if window is bigger than background make it only as big as background
    // else if (winW > 2560 || winH > 1600) {
    //     // canvas.width = 2560;
    //     // canvas.height = 1600;
    //     gameDiv.style.height = 2560 + "px";
    //     gameDiv.style.width = 1600 + "px";
    // }
    if (winW < 800 || winH < 600) {
        gameDiv.style.width = 800 + "px";
        gameDiv.style.height = 600 + "px";
    }
    else if (winW < 1440 && winW > 800 ) {
        gameDiv.style.width = winW * p + "px";
        gameDiv.style.height = winW * p * .6 + "px";
    } else {
        // // set game to fill p% of window
        // canvas.width = winW * p;
        // canvas.height = winH * p;

        if (winH > winW) {
            gameDiv.style.width = winW * p + "px";
            gameDiv.style.height = winW * p * .7 + "px";
        } else if (winW >= winH) {
            gameDiv.style.height = winH * p + "px";
            gameDiv.style.width = winH * p * 1.7 + "px";
        }
    }
}

// if window changes size change dom elements sizes
window.onresize = fitToScreen;

// set dom element sizes on page load
document.addEventListener('DOMContentLoaded', function () {
    fitToScreen();
}, false);