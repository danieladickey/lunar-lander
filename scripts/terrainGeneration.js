let TerrainGenerator = (function () {
    'use strict';

    let [leftBound, rightBound, topBound, bottomBound] = getBounds(document.getElementById("id-canvas").height,
        document.getElementById("id-canvas").width);
    let lowest_bound = document.getElementById("id-canvas").height - 10; // 10 px above bottom of canvas
    // a line is in the form of [startX, startY, endX, endY]

    // Returns a list of lines that form a mountain range
    function randomMidpointDisplacement(leftX, leftY, rightX, rightY) {
        let len = Math.abs(leftX - rightX)
        let n = Math.round(len / 100) + 4; // number of times to recurse (split line in half)
        if (n > 7) {
            n = 7;
        }
        let s = 3; // surface roughness factor

        return rmd(n, leftX, leftY, rightX, rightY, s);

        // Recursive helper for randomMidpointDisplacement where the height of the midpoint is randomly generated
        function rmd(n, ax, ay, bx, by, s) {
            // base case: return line
            if (n === 0) {
                return [[ax, ay, bx, by]];
            }
            do {
                var len = Math.abs(ax - bx); // get length of current line
                var r = s * Random.randomGaussianNumber() * len; // generate a random normal number based on the length of the line
                var x = bx - Math.round(len / 2); // middle of line: end - half the length
                var y = Math.round(.5 * (ay + by) + r); // calculate new height for middle of line
            } while (y < topBound || y > lowest_bound);
            s += .5;
            return rmd(n - 1, ax, ay, x, y, s).concat(rmd(n - 1, x, y, bx, by, s)); // recursively split line in half
        }
    }

    // get inside bounds based off size of canvas to objects away from edge etc
    function getBounds(canvasHeight, canvasWidth) {
        let leftBound = canvasWidth * .15; // 15% away from left edge
        let rightBound = canvasWidth - canvasWidth * .15; // 15% away from right edge
        let topBound = canvasHeight * .4; // 40% below top edge
        let bottomBound = canvasHeight - canvasHeight * .1; // 10% away from bottom edge

        // return a list of bounds
        return [leftBound, rightBound, topBound, bottomBound];
    }

    // Randomly generate start and end points of the surface terrain (farthest left and right points)
    function startAndEndPoints(canvasHeight, canvasWidth) {
        do {
            var leftY = Math.round(Math.random() * canvasHeight);
            var rightY = Math.round(Math.random() * canvasHeight);
        } while (leftY < topBound || leftY > bottomBound || rightY < topBound || rightY > bottomBound);

        // return a line that that goes across the width of the canvas
        return [0, leftY, canvasWidth, rightY]
    }

    // Produces a flat, safe spot for the lander to land inside the canvas, away from the edges, in the form of a line
    function makeLandingZone(canvasHeight, canvasWidth, shipWidth = 50) {
        // randomly create LZ until one is found inside the bounds
        do {
            var leftX = Math.round(Math.random() * canvasWidth);
            var rightX = leftX + shipWidth * 2;
            var y = Math.round(Math.random() * canvasHeight);
        } while (leftX < leftBound || rightX > rightBound || y < topBound || y > bottomBound);

        // return a flat line
        return [leftX, y, rightX, y]
    }

    // Creates a single LZ for the lander to safely land on
    function makeOneLZ(canvasHeight, canvasWidth, shipWidth) {
        // return a single flat line to be used as a landing zone
        return makeLandingZone(canvasHeight, canvasWidth, shipWidth);
    }

    // Creates two LZs for the lander to safely land on
    function makeTwoLZs(canvasHeight, canvasWidth, shipWidth) {
        do {
            var lz1 = makeLandingZone(canvasHeight, canvasWidth, shipWidth);
            var lz2 = makeLandingZone(canvasHeight, canvasWidth, shipWidth);
        } while (lz1[0] + shipWidth * 4 > lz2[0])

        // returns a list of 2 LZs
        return [lz1, lz2];
    }

    function levelTwo(canvasHeight, canvasWidth, shipWidth) {
        let startNEnd = startAndEndPoints(canvasHeight, canvasWidth);
        let lz = makeOneLZ(canvasHeight, canvasWidth, shipWidth);
        let leftTerrain = randomMidpointDisplacement(startNEnd[0], startNEnd[1], lz[0], lz[1]);
        let rightTerrain = randomMidpointDisplacement(lz[2], lz[3], startNEnd[2], startNEnd[3]);

        let below = [[startNEnd[2], startNEnd[3], canvasWidth, canvasHeight],
            [canvasWidth, canvasHeight, 0, canvasHeight], [0, canvasHeight, startNEnd[0], startNEnd[1]]];

        let surface = [];
        surface = surface.concat(leftTerrain);
        surface.push(lz);
        surface = surface.concat(rightTerrain);
        surface = surface.concat(below);
        return surface;
    }

    function levelOne(canvasHeight, canvasWidth, shipWidth) {
        let startNEnd = startAndEndPoints(canvasHeight, canvasWidth);
        let twoLZs = makeTwoLZs(canvasHeight, canvasWidth, shipWidth);
        let lz1 = twoLZs[0];
        let lz2 = twoLZs[1];
        let leftTerrain = randomMidpointDisplacement(startNEnd[0], startNEnd[1], lz1[0], lz1[1]);
        let middleTerrain = randomMidpointDisplacement(lz1[2], lz1[3], lz2[0], lz2[1]);
        let rightTerrain = randomMidpointDisplacement(lz2[2], lz2[3], startNEnd[2], startNEnd[3]);

        let below = [[startNEnd[2], startNEnd[3], canvasWidth, canvasHeight],
            [canvasWidth, canvasHeight, 0, canvasHeight], [0, canvasHeight, startNEnd[0], startNEnd[1]]];

        let surface = [];
        surface = surface.concat(leftTerrain);
        surface.push(lz1);
        surface = surface.concat(middleTerrain);
        surface.push(lz2);
        surface = surface.concat(rightTerrain);
        surface = surface.concat(below);
        return surface;
    }

    // api for terrain generation IIFE
    return {
        levelOne: levelOne,
        levelTwo: levelTwo
    }

})();
