// --------------------------------------------------------------
//
// Creates a Text object, with functions for managing state.
//
// spec = {
//    text: ,
//    font: ,
//    fillStyle: ,
//    strokeStyle: ,
//    position: { x: , y: }
// }
//
// --------------------------------------------------------------
MyGame.objects.Text = function (spec) {
    'use strict';

    let rotation = 0;

    function updateRotation(howMuch) {
        rotation += howMuch;
    }

    function updateColor(red, green, blue, alpha) {
        spec.fillStyle = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }

    function updateMessage(message) {
        spec.text = message;
    }

    let api = {
        updateColor: updateColor,
        updateMessage: updateMessage,
        get rotation() {
            return rotation;
        },
        get position() {
            return spec.position;
        },
        get text() {
            return spec.text;
        },
        get font() {
            return spec.font;
        },
        get fillStyle() {
            return spec.fillStyle;
        },
        get strokeStyle() {
            return spec.strokeStyle;
        },
        get strokeWidth() {
            return spec.strokeWidth;
        },
        get timeSinceLastUpdated() {
            return spec.timeSinceLastUpdated;
        },
        set timeSinceLastUpdated(n) {
            spec.timeSinceLastUpdated = n;
        },
        set position(pos) {
            spec.position = pos;
        }
    };

    return api;
}
