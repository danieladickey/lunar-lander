MyGame.screens['game-play'] = (function (game, objects, renderer, graphics, input, systems,) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;
    let cancelNextInput = false;
    let inPlay = true;
    let levelCount = 1;
    let score = 0;
    let explosionTimer = 60;
    let myKeyboard = input.Keyboard();
    let canPLayHappySound = true;
    let scoreSet = false;

    let explosionParticles = systems.ParticleSystem({
            center: {x: 300, y: 300},
            size: {mean: 70, stdev: 20},
            speed: {mean: 70, stdev: 25},
            lifetime: {mean: .1, stdev: 10}
        },
        graphics);

    let renderExplosionParticles = renderer.ParticleSystem(explosionParticles, graphics, 'assets/images/yellow_red_particle.png');

    let explosionParticles2 = systems.ParticleSystem({
            center: {x: 300, y: 300},
            size: {mean: 40, stdev: 20},
            speed: {mean: 100, stdev: 25},
            lifetime: {mean: .01, stdev: 10}
        },
        graphics);

    let renderExplosionParticles2 = renderer.ParticleSystem(explosionParticles2, graphics, 'assets/images/yellow_red_particle.png');

    let thrustParticles = systems.ParticleSystem({
            center: {x: 300, y: 300},
            size: {mean: 25, stdev: 20},
            speed: {mean: 200, stdev: 25},
            lifetime: {mean: .001, stdev: .1}
        },
        graphics);

    let renderThrustParticles = renderer.ParticleSystem(thrustParticles, graphics, 'assets/images/yellow_red_particle.png');

    let highScoreMessage = objects.Text({
        text: "New High Score: 1000",
        font: '30pt monospace',
        fillStyle: 'rgba(0, 255, 0, 1)',
        strokeStyle: 'rgba(0, 255, 0, 0)',
        position: {x: graphics.canvas.width / 2, y: 9 * graphics.canvas.height / 10},
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
    });

    let countDownMessage = objects.Text({
        text: "3",
        font: '50pt monospace',
        fillStyle: 'rgba(0, 255, 0, 1)',
        strokeStyle: 'rgba(0, 255, 0, 0)',
        position: {x: graphics.canvas.width / 3, y: graphics.canvas.height / 3},
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
    });

    let fuelMessage = objects.Text({
        text: "Fuel  : " + "00.00" + " s",
        font: '16pt monospace',
        fillStyle: 'rgba(0, 255, 0, 1)',
        strokeStyle: 'rgba(0, 255, 0, 0)',
        position: {x: 30, y: 30},
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
    });

    let speedMessage = objects.Text({
        text: "Speed : " + "00.00" + " m/s",
        font: '16pt monospace',
        fillStyle: 'rgba(0, 255, 0, 1)',
        strokeStyle: 'rgba(0, 255, 0, 0)',
        position: {x: 30, y: 60},
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
    })

    let angleMessage = objects.Text({
        text: "Angle : " + "000.0" + " " + String.fromCharCode(176),
        font: '16pt monospace',
        fillStyle: 'rgba(0, 255, 0, 1)',
        strokeStyle: 'rgba(0, 255, 0, 0)',
        position: {x: 30, y: 90},
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
    });

    let myLander = objects.Lander({
        imageSrc: 'assets/images/lunar_lander.png',
        center: {x: graphics.canvas.width / 2, y: graphics.canvas.height / 6},
        size: {width: 40, height: 40},
        radius: 23,
        rotateRate: 2,
        alive: true,
        fuel: 20,
        landed: false,
        thrustRate: .0004,
        thrust: {x: 0, y: 0},
        momentum: {x: .07, y: 0},
        rotation: 1,
    });

    let myBackground = objects.Background({
        imageSrc: 'assets/images/space.jpg',
        center: {x: 2560 / 2, y: 1400 / 2},
        size: {width: 2560, height: 1600}
    })

    let level2 = objects.Terrain({
        surface: TerrainGenerator.levelTwo(graphics.canvas.height, graphics.canvas.width, myLander.size.width),
        fillStyle: 'grey',
        strokeStyle: 'white',
        strokeWidth: 3,
    })
    let level1 = objects.Terrain({
        surface: TerrainGenerator.levelOne(graphics.canvas.height, graphics.canvas.width, myLander.size.width),
        fillStyle: 'grey',
        strokeStyle: 'white',
        strokeWidth: 3,
    })
    let level = level1;

    // checks for intercept of circle and line
    function lineCircleIntersection(line, cX, cY, cR) {
        let v1 = {x: line[2] - line[0], y: line[3] - line[1]};
        let v2 = {x: line[0] - cX, y: line[1] - cY};
        let b = -2 * (v1.x * v2.x + v1.y * v2.y);
        let c = 2 * (v1.x * v1.x + v1.y * v1.y);
        let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - cR * cR));
        if (isNaN(d)) { // no intercept
            return false;
        }
        // These represent the unit distance of point one and two on the line
        let u1 = (b - d) / c;
        let u2 = (b + d) / c;
        if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
            return true;
        }
        return u2 <= 1 && u2 >= 0;
    }

    // handles crashes and landings
    function collisionDetection(line, cX, cY, cR) {
        if (lineCircleIntersection(line, cX, cY, cR)) {
            // collision detected
            if (myLander.momentum.y < .05 && myLander.angle < 5 && myLander.angle > -5 && onPad()) {
                // landed safely
                inPlay = false;
                if (canPLayHappySound) {
                    clapAudio.play();
                    canPLayHappySound = false;
                }
                // add fuel to score upon landing
                if (!scoreSet) {
                    score += Math.round(myLander.fuel * 100);
                    scoreSet = true;
                }
                cancelNextInput = true;
            } else {
                // crashed
                myLander.alive = false;
                cancelNextInput = true;
                if (explosionTimer > 55) {
                    explostionAudio.play();
                }
                if (explosionTimer > 0 && explosionTimer < 20) {
                    explosionParticles.shipCrash(myLander);
                }
                if (explosionTimer > 30) {
                    explosionParticles2.shipCrash(myLander);
                }
                explosionTimer--;
            }
        }
    }

    // detect if ship hit terrain surface
    function detectShipCollision(surface, circleX, circleY, circleR) {
        // fore each section of the surface check for collision with ship
        for (let i = 0; i < surface.length; i++) {
            collisionDetection(surface[i], circleX, circleY, circleR);
        }
    }

    // ensure lander is on landing zone
    function onPad() {
        let pad1 = [];
        let pad2 = [];
        // fine left pad
        for (let i = 0; i < level.surface.length; i++) {
            if (thisLineIsLZ(level.surface[i])) {
                pad1 = level.surface[i];
                break;
            }
        }
        // find right pad
        for (let i = level.surface.length - 1; i >= 0; i--) {
            if (thisLineIsLZ(level.surface[i])) {
                pad2 = level.surface[i];
                break;
            }
        }
        // return true if lander is betwen pad ends and directly on top of he pad(s)
        return ((myLander.center.x - 10 > pad1[0] && myLander.center.x + 10 < pad1[2] && Math.abs(myLander.center.y - pad1[1]) < 25) ||
            (myLander.center.x - 10 > pad2[0] && myLander.center.x + 10 < pad2[2] && Math.abs(myLander.center.y - pad2[1]) < 25));
    }

    // returns true if this line is a landing zone
    function thisLineIsLZ(line) {
        return line[2] - line[0] === myLander.size.width * 2 &&
            line[1] === line[3]
    }

    // update the heads up display for screen
    function updateHUD(elapsedTime) {
        updateFuel();
        updateSpeed();
        updateAngle();

        // too fast
        if (myLander.momentum.y > .05 || myLander.momentum.y < -.05) {
            speedMessage.updateColor(255, 255, 255, 1);
        } else {
            speedMessage.updateColor(0, 255, 0, 1);
        }

        // no fuel left
        if (myLander.fuel <= 0) {
            fuelMessage.updateColor(255, 255, 255, 1);
        }
        else if (myLander.fuel === 20) {
            fuelMessage.updateColor(0, 255, 0, 1);
        }

        // not level
        if (myLander.angle > 5 || myLander.angle < -5) {
            angleMessage.updateColor(255, 255, 255, 1);
        } else {
            angleMessage.updateColor(0, 255, 0, 1);
        }
    }

    // formats the fuel and displays it on screen
    function updateFuel() {
        let f = myLander.fuel.toFixed(2);
        if (f < .001) {
            f = "00.00"
        } else if (f < 10) {
            f = "0" + f;
        }
        let m = "Fuel  : " + f + " s"
        fuelMessage.updateMessage(m);
    }

    // formats the angle of ship and displays it on the screen
    function updateAngle() {
        let a = myLander.angle;
        if (a < 0) {
            a += 360;
        }
        if (a > 360) {
            a -= 360;
        }
        a = a.toFixed(1);
        if (a < 10) {
            a = "00" + a;
        } else if (a < 100) {
            a = "0" + a;
        }
        let m = "Angle : " + a + " " + String.fromCharCode(176);
        angleMessage.updateMessage(m);
    }

    // formats the speed and displays it on screen
    function updateSpeed() {
        let s = myLander.momentum.y;
        s *= 40;
        s = Math.abs(s);
        s = s.toFixed(2);
        if (s < 10) {
            s = "0" + s;
        }
        let m = "Speed : " + s + " m/s";
        speedMessage.updateMessage(m);
    }

    // update score message
    function updateHighScoreMessage() {
        if (score > highScore["5"]) {
            highScoreMessage.updateMessage("New High Score: " + score);
        } else {
            highScoreMessage.updateMessage("Score: " + score);
        }
        let width = graphics.measureTextWidth(highScoreMessage);
        highScoreMessage.position = {x: graphics.canvas.width / 2 - (width / 2), y: 9 * graphics.canvas.height / 10};
    }

    // updates the countdown
    function updateCountDown(elapsedTime) {
        let width = graphics.measureTextWidth(countDownMessage);
        let height = graphics.measureTextHeight(countDownMessage);
        countDownMessage.position = {
            x: graphics.canvas.width / 2 - (width / 2),
            y: graphics.canvas.height / 2 - (height / 2)
        };
        countDownMessage.timeSinceLastUpdated += elapsedTime;

        if (countDownMessage.timeSinceLastUpdated >= 1000) {
            countDownMessage.updateMessage("2");
        }
        if (countDownMessage.timeSinceLastUpdated >= 2000) {
            countDownMessage.updateMessage("1");
        }
        if (countDownMessage.timeSinceLastUpdated >= 3000) {
            countDownMessage.updateMessage("0");
        }
        if (countDownMessage.timeSinceLastUpdated >= 4000) {
            countDownMessage.updateMessage("3");
            if (!myLander.alive) {
                endGame();
            } else if (levelCount === 1) {
                changeLevel();
            } else if (levelCount === 2) {
                endGame();
            }
        }
    }

    // calculate score send user to menu
    function endGame() {
        addSortSaveHighScores(score);
        if (myLander.alive) {
            scoreSet = false;
            game.showScreen('high-scores');
        } else {
            game.showScreen("main-menu");
        }
        cancelNextRequest = true;
        resetGame();
    }

    // reset game (if user died or beat game)
    function resetGame() {
        level1.surface = TerrainGenerator.levelOne(graphics.canvas.height, graphics.canvas.width, myLander.size.width);
        level2.surface = TerrainGenerator.levelTwo(graphics.canvas.height, graphics.canvas.width, myLander.size.width);
        levelCount = 1;
        score = 0;
        inPlay = true;
        cancelNextInput = false;
        countDownMessage.timeSinceLastUpdated = 0;
        level = level1;
        explosionTimer = 60;
        canPLayHappySound = true;
        resetLander();
    }

    // resets lander to default (for new level or new game)
    function resetLander() {
        myLander.fuel = 20;
        myLander.alive = true;
        myLander.rotation = 1;
        myLander.center = {x: graphics.canvas.width / 2, y: graphics.canvas.height / 6};
        myLander.momentum = {x: .07, y: 0};
    }

    // transitions to next level
    function changeLevel() {
        canPLayHappySound = true;
        scoreSet = false;
        levelCount = 2;
        resetLander();
        level = level2;
        inPlay = true;
        countDownMessage.timeSinceLastUpdated = 0;
        cancelNextInput = false;
    }

    // updates ships thrust (momentum) and renders particles
    function fireThrusters(elapsedTime) {
        myLander.thrust(elapsedTime);
        if (myLander.fuel > 0) {
            thrustParticles.shipThrust(myLander);
            thrusterAudio.play();
        }
    }

    function turnLeft(elapsedTime) {
        myLander.rotateLeft(elapsedTime);
    }

    function turnRight(elapsedTime) {
        myLander.rotateRight(elapsedTime);
    }

    // GET INPUT FROM USER ------------------------------------ GET INPUT FROM USER
    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }


    // UPDATE GAME STATUS ------------------------------------ UPDATE GAME STATUS
    function update(elapsedTime) {
        // check for collisions
        detectShipCollision(level.surface, myLander.center.x, myLander.center.y, myLander.radius);

        if (myLander.alive && inPlay) {
            myLander.update(elapsedTime);
        }

        updateHUD(elapsedTime);
        explosionParticles.update(elapsedTime);
        explosionParticles2.update(elapsedTime);
        thrustParticles.update(elapsedTime);

        if (!inPlay || !myLander.alive) {
            updateCountDown(elapsedTime);
        }
        if (!inPlay && levelCount === 2) {
            updateHighScoreMessage();
        }
    }


    // RENDER OBJECTS TO SCREEN ------------------------------------ RENDER OBJECTS TO SCREEN
    function render() {
        graphics.clear();
        renderer.Texture.render(myBackground);

        renderThrustParticles.render();
        if (myLander.alive) {
            renderer.Texture.render(myLander);
        }

        renderer.Terrain.render(level);

        renderExplosionParticles.render();
        renderExplosionParticles2.render();


        renderer.Text.render(fuelMessage);
        renderer.Text.render(speedMessage);
        renderer.Text.render(angleMessage);

        if (!inPlay || !myLander.alive) {
            renderer.Text.render(countDownMessage);
        }

        if (!inPlay && levelCount === 2) {
            renderer.Text.render(highScoreMessage);
        }
    }


    // THE GAME LOOP ------------------------------------ THE GAME LOOP
    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        if (!cancelNextInput) {
            processInput(elapsedTime);
        }
        update(elapsedTime);
        render();
        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        myKeyboard.register(controls.u, fireThrusters);
        myKeyboard.register(controls.l, turnLeft);
        myKeyboard.register(controls.r, turnRight);
        myKeyboard.register(controls.e, function () {
            //
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
            // Then, return to the main screens
            game.showScreen('pause');
        });
    }

    function run() {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run,
        resetGame: resetGame
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.systems));
