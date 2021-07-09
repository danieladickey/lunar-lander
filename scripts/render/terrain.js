// --------------------------------------------------------------
//
// Renders a Terrain object.
//
// --------------------------------------------------------------
MyGame.render.Terrain = (function (graphics) {
    'use strict';

    function render(spec) {
        graphics.drawLines(spec);
    }

    return {
        render: render
    };

}(MyGame.graphics));
