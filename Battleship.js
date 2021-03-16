
//---------------Setting up the VIEW object--------------------//
var view= {             
    displayMessage: function(msg){
        var messageArea= document.getElementById("messageArea");
        messageArea.innerHTML= msg;
    },
    displayHit: function(location){
        var cell= document.getElementById(location);
        cell.setAttribute("class","hit");
    },
    displayMiss: function(location){
        var cell= document.getElementById(location);
        cell.setAttribute("class","miss");
    }
};
//------------------------------------------------------------------------//
//------------------ Setting up the MODEL object--------------------------//
var model= {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{ locations: [0,0,0], hits: ["", "", ""]},
            { locations: [0,0,0], hits: ["", "", ""]},
            { locations: [0,0,0], hits: ["", "", ""]}],

    fire: function(guess) {

        for( var i=0; i<this.numShips; i++){
            var ship = this.ships[i];
            var locations = ship.locations;
            var index = locations.indexOf(guess);
            if( index>=0){
                //We have a hit!
                ship.hits[index]= "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if(this.isSunk(ship)){
                    view.displayMessage("You sank my battleship");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    isSunk: function(ship){
        for( var i=0; i< this.shipLength; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function(){
        var locations;
        for (var i=0; i<this.numShips; i++){
            do{
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations =locations;
        }
    },

    generateShip: function(){
        var direction = Math.floor(Math.random()*2);
        var row;
        var col;
        if(direction === 1){
            //Generate a starting location for a horizontal ship
            row= Math.floor(Math.random() * this.boardSize);
            col= Math.floor(Math.random() * (this.boardSize - (this.shipLength +1)));
        }
        else{
            //Generate a starting location for a verical ship
            row= Math.floor (Math.random () * (this.boardSize - (this.shipLength +1)));
            col= Math.floor (Math.random() * this.boardSize);
        }
        var newShipLocations= [];
        for( var i=0; i<this.shipLength; i++){
            if(direction ===1){
                //add location to  array for new hosrizontal ship
                newShipLocations.push( row + "" +(col +i));
            }
            else{
                //add location to array for new vertical ship
                newShipLocations.push((row +i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations){
        for( var i=0; i< this.numShips; i++){
            var ship = this.ships[i];
            for (var j=0; j<locations.length;j++){
                if(ship.locations.indexOf(locations[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }

    
};
//---------------------------------------------------//
//-------------Setting up the PARSEGUESS for boundary conditions-------------//
function parseGuess(guess){
    var alphabet= ["A", "B", "C", "D", "E", "F", "G"];

    if( guess === null || guess.length !== 2){
        alert(" Oops, please enter a letter and a number on the board.")
    }
    else{
        var firstChar= guess.charAt(0);
        var row= alphabet.indexOf(firstChar);
        var column= guess.charAt(1);

        if( isNaN(row) || isNaN(column)){
            alert("Oops, that isn't on the board");
        }
        else if(row <0 || row>= model.boardSize || column<0 || column>= model.boardSize){
        alert(" Oops, thats off the board");
        }
        else{
            return row + column;
        }
       return null; 
    }
}
//-------------------------------------------------------//
//---------------Setting up the CONTROLLER---------------//
var controller={

    guesses:0,

    processGuess: function (guess){
        var location = parseGuess(guess);
        if(location){
            this.guesses++;
            var hit= model.fire(location);
            if( hit && model.shipsSunk === model.numShips){
                view.displayMessage(" You Sank all my Battleships, in " + this.guesses + " guesses");
            
            }
        }
    }
};
//---------------------------------------------------------//
//-------------------------Setting up the FIRE BUTTON------//
function init(){
    var fireButton= document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress= handleKeyPress;
    model.generateShipLocations();
    //For Mobile Screens Alert///
    var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    if (mobile) {
            alert("Please visit the website on a computer for better view. Some parts of the grid may not align perfectly on a mobile screen");              
    } else {
    
    }
}

function handleFireButton(){
    var guessInput= document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value ="";
}
function handleKeyPress(e){
    var fireButton= document.getElementById("fireButton");
    if( e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

window.onload = init;

const toggleModal = () =>{
    document.querySelector('.modal')
        .classList.toggle('hidden');
};

document.querySelector('#play')
    .addEventListener('click', toggleModal);

document.querySelector('.modal-close span')
    .addEventListener('click', toggleModal);




