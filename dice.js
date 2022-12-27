// get the grid container element
var gridContainer = document.getElementById("grid-container");

// create an array of max values for each dice
var diceMaxValues = Array.from({length: 25}, () => Math.floor(Math.random() * 99) + 2);

// initialize click counter
var clickCounter = 100;

// set a game over flag
var gameoverFlag = 0;


// generate the dice grid
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    // use the max value for the current dice from the diceMaxValues array
    let pointer = (i*5);
    let dice = Math.floor(Math.random() * (diceMaxValues[pointer+j] - 1)) + 1;
    let diceElement = document.createElement("div");
    diceElement.className = "dice";
    diceElement.textContent = dice;
    gridContainer.appendChild(diceElement);
  }
  let lineBreak = document.createElement("br");
  gridContainer.appendChild(lineBreak);
}

// calculate initial score
window.addEventListener('load', function() {
  // re-calculate the score
  var updatedScore = calcScore();
  // update the text content of the score element
  scoreElement.textContent = labelElement.textContent + updatedScore;
});


// get all dice elements
const diceElements = document.querySelectorAll('.dice');


// add a click event listener to each dice element
diceElements.forEach((dice, i) => {
  dice.addEventListener('click', function() {
  
  if (clickCounter > 0) {
  clickCounter--;
  counterElement.textContent = 'Clicks Remaining: ' + clickCounter;

    var newDiceValue = Math.floor(Math.random() * diceMaxValues[i]) + 1;
    dice.textContent = newDiceValue;
    dice.classList.add('blink');
    dice.addEventListener('animationend', function() {
      dice.classList.remove('blink');
      updatedScore = calcScore();
      scoreElement.textContent = labelElement.textContent + updatedScore;
      });
  
  }  

  if (clickCounter < 1) {
    gameoverFlag = 1;
    labelElement.textContent = 'Final Score: ';
    scoreElement.textContent = labelElement.textContent + updatedScore;
   
    // Remove the event listener to disable further clicks
    dice.removeEventListener('click', arguments.callee);
  }

  });
});


//RE-ROLL BUTTON
const rerollButton = document.createElement('button');
rerollButton.textContent = 'RE-ROLL ALL DICE';
gridContainer.appendChild(rerollButton);
rerollButton.classList.add('reroll-button');

rerollButton.addEventListener('click', function() {
    
  if (clickCounter > 0) { 
  clickCounter--;
  counterElement.textContent = 'Clicks Remaining: ' + clickCounter;  

  diceElements.forEach((dice, i) => {
    var newDiceValue = Math.floor(Math.random() * diceMaxValues[i]) + 1;
    dice.textContent = newDiceValue;
  });

    updatedScore = calcScore();
    scoreElement.textContent = labelElement.textContent + updatedScore;
      
  }
    
  if (clickCounter < 1) {
    gameoverFlag = 1;
    labelElement.textContent = 'Final Score: ';
    scoreElement.textContent = labelElement.textContent + updatedScore;
   
  }    

});


//RE-SET BUTTON
const resetButton = document.createElement('button');
resetButton.textContent = 'RESET MAX VALUES AND RE-ROLL';
gridContainer.appendChild(resetButton);
resetButton.classList.add('reset-button'); 

resetButton.addEventListener('click', function() {
    
if (clickCounter > 0) {
  clickCounter--;
  counterElement.textContent = 'Clicks Remaining: ' + clickCounter;      
  
var newDiceMaxValues = Array.from({length: 25}, () => Math.floor(Math.random() * 99) + 2);
  diceMaxValues = newDiceMaxValues;

  diceElements.forEach((dice, i) => {
    var newDiceValue = Math.floor(Math.random() * diceMaxValues[i]) + 1;
    dice.textContent = newDiceValue;
  });
  
  updatedScore = calcScore();
  scoreElement.textContent = labelElement.textContent + updatedScore;
    
}
    
  if (clickCounter < 1) {
    gameoverFlag = 1;
    labelElement.textContent = 'Final Score: ';
    scoreElement.textContent = labelElement.textContent + updatedScore;
   
  }      
  
});


//CLICK COUNTER
// Create a new div element to display the counter
const counterElement = document.createElement('div');
counterElement.classList.add('counter');
// Set the text content of the counter element
counterElement.textContent = 'Clicks Remaining: ' + clickCounter;
// Add the counter element to the DOM
gridContainer.appendChild(counterElement);



// SCORE
// create a new div element to display the score
const scoreElement = document.createElement('div');
// add a class name to the score element
scoreElement.classList.add('score');
// create a new span element to display the label
var labelElement = document.createElement('span');
// set the text content of the label element
labelElement.textContent = 'Score: ';
// append the label element to the score element
scoreElement.appendChild(labelElement);
// create a new span element to display the score value
const valueElement = document.createElement('span');
// set the text content of the value element to 0 initially
valueElement.textContent = '0';
// append the value element to the score element
scoreElement.appendChild(valueElement);
// add the score element to the DOM
gridContainer.appendChild(scoreElement);



function calcScore() {
  let score = 0;
  diceElements.forEach(dice => {
    score += parseInt(dice.textContent);
  });
  return score;
}





