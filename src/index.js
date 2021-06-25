define(["require", "exports", "./game/game"], function (require, exports, game_1) {
    "use strict";
    exports.__esModule = true;
    var game = new game_1.Game();
    var notAWinner = false;
    game.add('Chet');
    game.add('Pat');
    game.add('Sue');
    do {
        game.roll(Math.floor(Math.random() * 6) + 1);
        if (Math.floor(Math.random() * 10) == 7) {
            notAWinner = game.wrongAnswer();
        }
        else {
            notAWinner = game.wasCorrectlyAnswered();
        }
    } while (notAWinner);
});
