// --------------------------------------------------------------
//
// Creates a terrain object, with functions for managing state.
//
// --------------------------------------------------------------
MyGame.objects.Terrain = function (spec) {
    'use strict';

    let api = {
        get surface() {
            return spec.surface;
        },
        get strokeWidth() {
            return spec.strokeWidth;
        },
        get fillStyle() {
            return spec.fillStyle;
        },
        get strokeStyle() {
            return spec.strokeStyle;
        },
        set surface(terrain) {
            spec.surface = terrain;
        }
    };

    return api;
}
