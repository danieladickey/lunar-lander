Random = (function () {
    'use strict';
    // Produces a randomly generated normal/Gaussian number with mean of 0 and variation of 1
    // Of my own creation, works well enough for the uses of this assignment
    function randomGaussianNumber(mu = 0, sigma = 1) {
        let v = 5; // "variance"; larger v means more normal; smaller v = faster computation
        let r = 0;
        for (let i = 0; i < v; i++) {
            r += Math.random();
        }
        let posNeg = Math.random() < .5 ? 1 : -1; // 50% of being negative
        sigma *= posNeg;
        sigma /= 5;
        return (((r / v) - .5) * 2 + mu) + sigma;
    }

    // returns a random vector pointing in 360 degrees
    function randomCircleVector() {
        let angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    return {
        randomGaussianNumber : randomGaussianNumber,
        randomCircleVector : randomCircleVector,
    }

})();
