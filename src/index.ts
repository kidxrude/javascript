import {Game} from "./game/game";

document.addEventListener('DOMContentLoaded', (event) => {

    let game: Game = new Game();

    let notAWinner = false;

    game.add('Chet');
    game.add('Pat');
    game.add('Sue');

    game.pushQuestions();


    do {
        game.roll(Math.floor(Math.random() * 6) + 1);

        if (Math.floor(Math.random() * 10) == 7) {
            notAWinner = game.wrongAnswer();
        } else {
            notAWinner = game.wasCorrectlyAnswered();
            if (!notAWinner) {
                game.gameSummary();
            }
        }

    } while (notAWinner);


});
