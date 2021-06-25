export class Game {
    players: string[] = [];
    places: number[] = [];
    purses: number[] = [];
    inPenaltyBox: boolean[] = [];
    states: string[] = ['danger', 'success', 'info'];

    popQuestions: string[] = [];
    scienceQuestions: string[] = [];
    sportsQuestions: string[] = [];
    rockQuestions: string[] = [];

    currentRoll: number = 0;
    winner: number = 0;

    currentPlayer = 0;
    isGettingOutOfPenaltyBox = false;

    didPlayerWin() {
        return !(this.purses[this.currentPlayer] == 6)
    }

    currentCategory() {
        if (this.places[this.currentPlayer] == 0)
            return 'Pop';
        if (this.places[this.currentPlayer] == 4)
            return 'Pop';
        if (this.places[this.currentPlayer] == 8)
            return 'Pop';
        if (this.places[this.currentPlayer] == 1)
            return 'Science';
        if (this.places[this.currentPlayer] == 5)
            return 'Science';
        if (this.places[this.currentPlayer] == 9)
            return 'Science';
        if (this.places[this.currentPlayer] == 2)
            return 'Sports';
        if (this.places[this.currentPlayer] == 6)
            return 'Sports';
        if (this.places[this.currentPlayer] == 10)
            return 'Sports';
        return 'Rock';
    }

    createRockQuestion(index: number) {
        return "Rock Question " + index;
    }

    pushQuestions() {
        for (var i = 0; i < 50; i++) {
            this.popQuestions.push("Pop Question " + i);
            this.scienceQuestions.push("Science Question " + i);
            this.sportsQuestions.push("Sports Question " + i);
            this.rockQuestions.push(this.createRockQuestion(i));
        }
    }

    add(playerName: string) {
        this.players.push(playerName);

        let state = this.states[this.howManyPlayers() - 1];

        this.places[this.howManyPlayers() - 1] = 0;
        this.purses[this.howManyPlayers() - 1] = 0;
        this.inPenaltyBox[this.howManyPlayers() - 1] = false;


        this.gameMessage(this.displayInBold(playerName) + " was added", state, false);
        this.gameMessage("They are player number " + this.displayInBadge(this.players.length.toString()), state, false);

        return true;
    }

    howManyPlayers() {
        return this.players.length;
    }

    askQuestion() {
        let question: string = "";

        if (this.currentCategory() == 'Pop')
            question = this.popQuestions.shift()!;
        if (this.currentCategory() == 'Science')
            question = this.scienceQuestions.shift()!;
        if (this.currentCategory() == 'Sports')
            question = this.sportsQuestions.shift()!;
        if (this.currentCategory() == 'Rock')
            question = this.rockQuestions.shift()!;

        this.gameMessage(question);
    }

    roll(roll: number) {
        this.currentRoll++;

        let panel = this.gameRollPanel(this.currentRoll);
        let msgBox = document.getElementById('game-box')!;
        msgBox.innerHTML += panel.innerHTML;


        this.gameMessage(this.displayInBold(this.players[this.currentPlayer]) + " is the current player");
        this.gameMessage("They have rolled a " + this.displayInBadge(roll.toString()));

        if (this.inPenaltyBox[this.currentPlayer]) {
            if (roll % 2 != 0) {
                this.isGettingOutOfPenaltyBox = true;

                this.gameMessage(this.displayInBold(this.players[this.currentPlayer]) + " is getting out of the penalty box");
                this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
                if (this.places[this.currentPlayer] > 11) {
                    this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
                }

                this.gameMessage(this.displayInBold(this.players[this.currentPlayer]) + "'s new location is " + this.displayInBadge(this.places[this.currentPlayer].toString()));
                this.gameMessage("The category is " + this.displayInBold(this.currentCategory().toString()));
                this.askQuestion();
            } else {
                this.gameMessage(this.displayInBold(this.players[this.currentPlayer].toString()) + " is not getting out of the penalty box");
                this.isGettingOutOfPenaltyBox = false;
            }
        } else {

            this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
            if (this.places[this.currentPlayer] > 11) {
                this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
            }

            this.gameMessage(this.displayInBold(this.players[this.currentPlayer].toString()) + "'s new location is " + this.displayInBadge(this.places[this.currentPlayer].toString()));
            this.gameMessage("The category is " + this.displayInBold(this.currentCategory().toString()));
            this.askQuestion();
        }

    }

    wasCorrectlyAnswered() {
        let state: string = 'success';
        if (this.inPenaltyBox[this.currentPlayer]) {
            if (this.isGettingOutOfPenaltyBox) {
                this.gameMessage('Answer was correct!!!!', state);
                this.purses[this.currentPlayer] += 1;
                this.gameMessage(this.displayInBold(this.players[this.currentPlayer]) + " now has " +
                    this.displayInBadge(this.purses[this.currentPlayer].toString()) + " Gold Coins.", state);

                var winner = this.didPlayerWin();
                this.winner = this.currentPlayer;

                this.currentPlayer += 1;
                if (this.currentPlayer == this.players.length)
                    this.currentPlayer = 0;

                return winner;
            } else {
                this.currentPlayer += 1;
                if (this.currentPlayer == this.players.length)
                    this.currentPlayer = 0;
                return true;
            }


        } else {

            this.gameMessage("Answer was correct!!!!", state);

            this.purses[this.currentPlayer] += 1;
            this.gameMessage(this.displayInBold(this.players[this.currentPlayer]) + " now has " +
                this.displayInBadge(this.purses[this.currentPlayer].toString()) + " Gold Coins.", state);

            var winner = this.didPlayerWin();
            this.winner = this.currentPlayer;
            this.currentPlayer += 1;
            if (this.currentPlayer == this.players.length)
                this.currentPlayer = 0;

            return winner;
        }
    }

    wrongAnswer() {
        let state = 'danger';

        this.gameMessage('Question was incorrectly answered', state);
        this.gameMessage(this.displayInBold(this.players[this.currentPlayer]) + " was sent to the penalty box", state);
        this.inPenaltyBox[this.currentPlayer] = true;

        this.currentPlayer += 1;
        if (this.currentPlayer == this.players.length)
            this.currentPlayer = 0;
        return true;
    }

    gameRollPanel(roll: number) {
        let gameRoll = document.createElement("div");
        let state: string = this.states[this.currentPlayer];
        gameRoll.innerHTML = `
            <div class="panel panel-${state}">
              <div class="panel-heading">
                <h3 class="panel-title">Roll #${roll}</h3>
              </div>
              <div class="panel-body">
                <div id="roll-#${roll}">
              
                </div>
                
              </div>
            </div>
        `;
        return gameRoll;
    }

    gameMessage(
        message: string,
        state: string = 'default',
        addToRollMessages: boolean = true
    ) {

        if (addToRollMessages) {

            let html = `
                <button type="button" class="btn btn-${state}">${message}</button><br/>  
            `;

            var msgBox = document.getElementById('roll-#' + this.currentRoll)!;
            if (typeof msgBox.innerHTML === 'undefined') {
                msgBox.innerHTML = html;
            } else {
                msgBox.innerHTML += html;
            }

        } else {

            this.displayMessagesForGame(message, state);
        }

    }

    displayMessagesForGame(message: string, state: string) {
        var setupBox = document.getElementById('setup-box')!;
        var html = `
                <div class="alert alert-dismissable alert-${state}">
                    <strong>${message}</strong>
                </div>
            `;
        setupBox.innerHTML += html;
    }

    displayInBadge(value: string) {
        let badge: string = `<span class="badge">${value}</span>`;
        return badge;
    }

    displayInBold(value: string) {
        let strong: string = `<strong>${value}</strong>`;
        return strong;
    }

    gameSummary() {
        let html: string = `
            <div class="panel panel-success">
                <div class="panel-heading">
                    <h3 class="panel-title">Game Summary</h3>
                </div>
                <div class="panel-body">
                    And the winner is ...  <br/>
                    <button type="button" class="btn btn-success"><strong>${this.players[this.winner]}</strong></button><br/>       
                </div>
            </div>
        `;
        let summaryBox = document.getElementById('summary-box')!;
        summaryBox.innerHTML = html;

    }


}
