MyGame.graphics = (function () {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    // draws a list of lines
    function drawLines(spec) {
        context.lineWidth = spec.strokeWidth;
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.beginPath();
        let lines = spec.surface;

        context.moveTo(lines[0][0], lines[0][1]);

        for (let line = 0; line < lines.length; line++) {
            context.lineTo(lines[line][2], lines[line][3]);
        }
        context.closePath();
        context.stroke();
        context.fill();
    }

    function drawText(spec) {
        context.save();

        context.lineWidth = spec.strokeWidth;

        context.font = spec.font;
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.textBaseline = 'top';

        context.translate(spec.position.x, spec.position.y);
        context.rotate(spec.rotation);
        context.translate(-spec.position.x, -spec.position.y);

        context.fillText(spec.text, spec.position.x, spec.position.y);
        context.strokeText(spec.text, spec.position.x, spec.position.y);

        context.restore();
    }

    // Gets the width of a text / message / font
    function measureTextWidth(spec) {
        context.save();

        context.font = spec.font;
        let width = context.measureText(spec.text).width;

        context.restore();

        return width;
    }

    // Gets the height of a text / message / font
    function measureTextHeight(spec) {
        context.save();

        context.font = spec.font;
        let height = context.measureText('m').width;

        context.restore();

        return height;
    }

    let api = {
        get canvas() {
            return canvas;
        },
        clear: clear,
        drawTexture: drawTexture,
        drawText: drawText,
        drawLines: drawLines,
        measureTextWidth: measureTextWidth,
        measureTextHeight: measureTextHeight,
    };

    return api;
}());
