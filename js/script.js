const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
        { locations: [0, 0, 0], hits: ['', '', ''] },
        { locations: [0, 0, 0], hits: ['', '', ''] },
        { locations: [0, 0, 0], hits: ['', '', ''] }
    ],
    // check-in with hard-coded for ship locations
/*
	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
		{ locations: ["10", "11", "12"], hits: ["", "", ""] }
	],
*/
   
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            const index = ship.locations.indexOf(guess);
            
            //if ship was sunken, making notification for user and return true
            if (ship.hits[index] === "hit") {
                view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');

                if (this.isSunk(ship)) {
                    view.displayMessage('You sunk my battleship!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed.');
        return false;
    },

    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("Ships array: ");
		console.log(this.ships);
    },

    generateShip: function () {
        //generating 0 or 1. 
        //0 - vertical, 1 - horizontal
        const direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) { //horizontal
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else { //vertical
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            const ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};
//Testing shoots
// model.fire('53');

// model.fire('06');
// model.fire('16');
// model.fire('26');

// model.fire('34');
// model.fire('24');
// model.fire('44');

// model.fire('12');
// model.fire('11');
// model.fire('10');

const view = {
    displayMessage: function (msg) {
        const messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        const cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },

    displayMiss: function (location) {
        const cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
};

const controller = {
    guesses: 0,
    
    processGuess: function (guess) {
        const location = parseGuess(guess);
        if (location) {
            this.guesses++;
            const hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(`You sank all my battleships, in ${this.guesses} guesses.`);
            }
        }
    }
}
//testing shoots 

//controller.processGuess('A0');

// controller.processGuess('A6');
// controller.processGuess('B6');
// controller.processGuess('C6');

// controller.processGuess('C4');
// controller.processGuess('D4');
// controller.processGuess('E4');

// controller.processGuess('B0');
// controller.processGuess('B1');
// controller.processGuess('B2');

// helpful function for users request

function parseGuess(guess) {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    if (guess === null || guess.length !== 2) {
        alert('Oops, please enter a letter and a number on the board');
    } else {
        const firstChar = guess.charAt(0);
        const row = alphabet.indexOf(firstChar);
        const column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert('Oops, that is not on the board.')
        } else if (row < 0 || row >= model.boardSize ||
                   column < 0 || column >= model.boardSize) {
            alert('Oops, that is off board!');
        } else {
            return row + column;
        }
    }
    return null;
}
// console.log(parseGuess('A0'));
// console.log(parseGuess('B6'));
// console.log(parseGuess('G3'));
// console.log(parseGuess('H0'));
// console.log(parseGuess('A7'));


// event handlers

function handleFireButton() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.toUpperCase();

    controller.processGuess(guess);
    guessInput.value = '';
}

function handleKeyPress(e) {
    const fireButton = document.getElementById('fireButton');

    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

// init - uploading after, full page would be loaded
 window.onload = init;

function init() {
    // Fire! button onclick handler
    const fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;

    //handle "return" key press
    const guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    // place the ships on the game board
    model.generateShipLocations();
}





