//------------------------------------------------------------------
//
// This is the particle system use by the game code
//
//------------------------------------------------------------------
MyGame.systems.ParticleSystem = function(spec) {
    'use strict';
    let nextName = 1;       // Unique identifier for the next particle
    let particles = {};

    //------------------------------------------------------------------
    //
    // This creates one new particle for an explosion (circularly)
    //
    //------------------------------------------------------------------
    function createExplosion(centerX, centerY) {
        let size = Random.randomGaussianNumber(spec.size.mean, spec.size.stdev);
        return {
            center: {x: centerX, y: centerY},
            size: {width: size, height: size},  // Making square particles
            direction: Random.randomCircleVector(),
            speed: Random.randomGaussianNumber(spec.speed.mean, spec.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.randomGaussianNumber(spec.lifetime.mean, spec.lifetime.stdev),    // How long the particle should live, in seconds
            alive: 0    // How long the particle has been alive, in seconds
        };
    }

    //------------------------------------------------------------------
    //
    // This creates one new particle for an thruster (linearly)
    //
    //------------------------------------------------------------------
    function createThruster(centerX, centerY, directionVectorX, directionVectorY) {
        let size = Random.randomGaussianNumber(spec.size.mean, spec.size.stdev);
        return {
            center: {x: centerX + directionVectorX * -18, y: centerY + directionVectorY * -18},
            size: {width: size, height: size},  // Making square particles
            direction: {x: Random.randomGaussianNumber(directionVectorX, .5) * -1, y: Random.randomGaussianNumber(directionVectorY, .5) * -1},
            speed: Random.randomGaussianNumber(spec.speed.mean, spec.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.randomGaussianNumber(spec.lifetime.mean, spec.lifetime.stdev),    // How long the particle should live, in seconds
            alive: 0    // How long the particle has been alive, in seconds
        };
    }

    //------------------------------------------------------------------
    //
    // Update the state of all particles.  This includes removing any that have exceeded their lifetime.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        let removeMe = [];

        //
        // We work with time in seconds, elapsedTime comes in as milliseconds
        elapsedTime = elapsedTime / 1000;
        
        Object.getOwnPropertyNames(particles).forEach(function(value, index, array) {
            let particle = particles[value];
            //
            // Update how long it has been alive
            particle.alive += elapsedTime;

            //
            // Update its center
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

            //
            // Rotate proportional to its speed
            particle.rotation += particle.speed / 500;

            //
            // If the lifetime has expired, identify it for removal
            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });

        //
        // Remove all of the expired particles
        for (let particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;
    }

    // creates new particles when ship explodes
    function shipCrash(ship) {
        let center = ship.center;
        //
        // Generate some new particles
        for (let particle = 0; particle < 2; particle++) {
            //
            // Assign a unique name to each particle
            particles[nextName++] = createExplosion(center.x, center.y);
        }
    }

    // creates new particles when ship is thrusting
    function shipThrust(ship) {
        let center = ship.center;
        let vector = ship.thrustVector;
        //
        // Generate some new particles
        for (let particle = 0; particle < 3; particle++) {
            //
            // Assign a unique name to each particle
            particles[nextName++] = createThruster(center.x, center.y, vector.x, vector.y);
        }
    }

    let api = {
        update: update,
        shipThrust: shipThrust,
        shipCrash: shipCrash,
        get particles() { return particles; }
    };

    return api;
}
