// --------------------------------------------------------------
//
// Creates a Background object, with limited functions for managing state.
//
// spec = {
//    imageSrc: ,   // Web server location of the image
//    center: { x: , y: },
//    size: { width: , height: }
// }
//
// --------------------------------------------------------------
MyGame.objects.Background = function (spec) {
    'use strict';

    let imageReady = false;
    let image = new Image();

    image.onload = function () {
        imageReady = true;
    };
    image.src = spec.imageSrc;


    let api = {
        get imageReady() {
            return imageReady;
        },
        get image() {
            return image;
        },
        get center() {
            return spec.center;
        },
        get size() {
            return spec.size;
        }
    };

    return api;
}
