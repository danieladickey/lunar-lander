MyGame.screens['main-menu'] = (function (game) {
    'use strict';

    function initialize() {
        // Setup each of screens events for the screens
        document.getElementById('id-new-game').addEventListener(
            'click',
            function () {
                game.showScreen('game-play');
            });

        document.getElementById('id-high-scores').addEventListener(
            'click',
            function () {
                game.showScreen('high-scores');
            });

        document.getElementById('id-instructions').addEventListener(
            'click',
            function () {
                game.showScreen('instructions');
            });

        document.getElementById('id-settings').addEventListener(
            'click',
            function () {
                game.showScreen('settings');
            }
        )

        document.getElementById('id-credits').addEventListener(
            'click',
            function () {
                game.showScreen('credits');
            });
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game));
