// --------------------------------------------------------------
//
// Creates a Lander object, with functions for managing state.
//
// spec = {
//    imageSrc: ,   // Web server location of the image
//    center: { x: , y: },
//    size: { width: , height: }
// }
//
// --------------------------------------------------------------
MyGame.objects.Lander = function (spec) {
    'use strict';
    let imageReady = false;
    let image = new Image();

    image.onload = function () {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    function rotateLeft(elapsedTime) {
        spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
    }

    function rotateRight(elapsedTime) {
        spec.rotation += spec.rotateRate * (elapsedTime / 1000);
    }

    function thrust(elapsedTime) {
        // if there is fuel
        if (spec.fuel > 0) {
            // calculate thrust vector from angle of ship in radians
            spec.thrust.x = Math.cos(spec.rotation - Math.PI / 2);
            spec.thrust.y = Math.sin(spec.rotation - Math.PI / 2);

            // add thrust vector to momentum vector
            spec.momentum.x += (spec.thrust.x * spec.thrustRate * elapsedTime);
            spec.momentum.y += (spec.thrust.y * spec.thrustRate * elapsedTime);

            // subtract used fuel from gauge
            spec.fuel -= .13;
        }
    }

    const GRAVITY = -.05;

    function update(elapsedTime) {
        if (spec.alive) {
            // updates the constant pull of gravity on the lander
            spec.momentum.y -= (GRAVITY * elapsedTime / 1000);
            spec.center.x += (spec.momentum.x * elapsedTime)
            spec.center.y += (spec.momentum.y * elapsedTime)
        }
    }


    let api = {
        thrust: thrust,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        update: update,
        get imageReady() {
            return imageReady;
        },
        get rotation() {
            return spec.rotation; // returns radians
        },
        get angle() {
            return spec.rotation * 180 / Math.PI; // returns degrees
        },
        get image() {
            return image;
        },
        get center() {
            return spec.center;
        },
        get size() {
            return spec.size;
        },
        get radius() {
            return spec.radius
        },
        get fuel() {
            return spec.fuel;
        },
        get momentum() {
            return spec.momentum
        },
        get alive() {
            return spec.alive;
        },
        set alive(b) {
            spec.alive = b;
        },
        get thrustVector() {
            return {x: spec.thrust.x, y:spec.thrust.y};
        },
        set fuel(f) {
            spec.fuel = f;
        },
        set rotation(r) {
            spec.rotation = r;
        },
        set center(c) {
            spec.center = c;
        },
        set momentum(m) {
            spec.momentum = m;
        },
    };

    return api;
}
