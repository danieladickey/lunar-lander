'use strict';

// default controls:
let controls = {
    u: 'ArrowUp',
    l: 'ArrowLeft',
    r: 'ArrowRight',
    e: 'Escape'
}

// default high scores
let highScore = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
}

// fetch previously saved controls
let previousControls = localStorage.getItem('savedControls');

// fetch previously saved scores
let previousHighScores = localStorage.getItem('savedScores');

// if not null parse it (take string turn it into code) ...this seems like a security risk...
if (previousControls !== null) {
    controls = JSON.parse(previousControls);
}

// if not null parse it (take string turn it into code) ...this seems like a security risk...
if (previousHighScores !== null) {
    highScore = JSON.parse(previousHighScores);
}

// set buttons to show controls when website loads this script
document.getElementById("set-up-key").innerHTML = controls.u;
document.getElementById("set-left-key").innerHTML = controls.l;
document.getElementById("set-right-key").innerHTML = controls.r;
document.getElementById("set-esc-key").innerHTML = controls.e;

// set high scores when website loads this script
addSortSaveHighScores();

// function to add a key and save it on local machine
function saveKeyControl(key, value) {
    controls[key] = value; // set for game
    localStorage['savedControls'] = JSON.stringify(controls); // save locally
}

// function to add/sort/save high scores on local machine
function addSortSaveHighScores(newScore = 0) {
    // take high scores and put into a list for sorting
    let list = [];
    list.push(highScore["1"]);
    list.push(highScore["2"]);
    list.push(highScore["3"]);
    list.push(highScore["4"]);
    list.push(highScore["5"]);
    // add a new score if given one, else add 0 to list
    list.push(newScore);
    // sort list by largest to smallest
    list.sort(function (a, b) {
        return b - a
    });

    // update high score object with sorted scores
    highScore["1"] = list[0];
    highScore["2"] = list[1];
    highScore["3"] = list[2];
    highScore["4"] = list[3];
    highScore["5"] = list[4];

    // save scores to local machine
    localStorage['savedScores'] = JSON.stringify(highScore);

    // show high scores on high score page
    document.getElementById("1").innerHTML = highScore["1"];
    document.getElementById("2").innerHTML = highScore["2"];
    document.getElementById("3").innerHTML = highScore["3"];
    document.getElementById("4").innerHTML = highScore["4"];
    document.getElementById("5").innerHTML = highScore["5"];

    return list[list.length - 1] !== newScore;
}

// function that is called when user sets a key
function setLocalData(id, key) {
    switch (id) {
        case "set-up-key":
            saveKeyControl('u', key);
            break;
        case "set-left-key":
            saveKeyControl('l', key);
            break;
        case "set-right-key":
            saveKeyControl('r', key);
            break;
        case "set-esc-key":
            saveKeyControl('e', key);
            break;
        default:
    }
}

