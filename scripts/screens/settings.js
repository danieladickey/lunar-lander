MyGame.screens['settings'] = (function (game) {
    'use strict';

    function initialize() {
        // Go back to main screens...
        document.getElementById('id-settings-back').addEventListener(
            'click',
            function () {
                game.showScreen('main-menu');
                MyGame.game.initialize();
            });
        // up
        document.getElementById('set-up-key').addEventListener(
            'click',
            function () {
                getKey("set-up-key");
            }
        )

        // left
        document.getElementById('set-left-key').addEventListener(
            'click',
            function () {
                getKey("set-left-key");
            }
        )

        // right
        document.getElementById('set-right-key').addEventListener(
            'click',
            function () {
                getKey("set-right-key");
            }
        )

        // escape
        document.getElementById('set-esc-key').addEventListener(
            'click',
            function () {
                getKey("set-esc-key");
            }
        )
    }

    // get which key to set
    function getKey(buttonID) {
        document.getElementById(buttonID).className = "btn btn-warning controls";
        document.getElementById(buttonID).innerHTML = "Press Any Key";
        setIt = true; // allows event listener to set the key
    }

    // if a setting button was clicked it takes next input and sets the key
    function setKey(e) {
        if (setIt) {
            e.target.innerHTML = e.key;
            setLocalData(e.target.id, e.key);
            e.target.className = "btn btn-success controls";
            setIt = false; // deactivate even listener
            setTimeout(function () {
                e.target.className = "btn btn-danger controls";

            }, 500)
        }
    }

    let setIt = false; // should the event listener set the key
    addEventListener("keydown", setKey); // event listener for setting keys

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game));
