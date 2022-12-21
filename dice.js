// get the grid container element
const gridContainer = document.getElementById("grid-container");

// create an array of max values for each dice
const diceMaxValues = Array.from({length: 100}, () => Math.floor(Math.random() * 99) + 2);

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    // use the max value for the current dice from the diceMaxValues array
    let dice = Math.floor(Math.random() * diceMaxValues[i]) + 1;
    let diceElement = document.createElement("div");
    diceElement.className = "dice";
    diceElement.textContent = dice;
    gridContainer.appendChild(diceElement);
  }
  let lineBreak = document.createElement("br");
  gridContainer.appendChild(lineBreak);
}

window.addEventListener('load', function() {
  // re-calculate the score
  let updatedScore = calcScore();
  // update the text content of the score element
  scoreElement.textContent = "Score: " + updatedScore;
});



// get all dice elements
const diceElements = document.querySelectorAll('.dice');



// add a click event listener to each dice element
diceElements.forEach((dice, i) => {
  dice.addEventListener('click', function() {
    // use the max value for the current dice from the diceMaxValues array
    let newDiceValue = Math.floor(Math.random() * diceMaxValues[i]) + 1;
    dice.textContent = newDiceValue;
    dice.classList.add('blink');
    dice.addEventListener('animationend', function() {
      dice.classList.remove('blink');
      let updatedScore = calcScore();
      scoreElement.textContent = "Score: " + updatedScore;
    });
  });
});

// create a new button element
const rerollButton = document.createElement('button');
// set the text content of the button
rerollButton.textContent = 'RE-ROLL ALL';
// add the button to the DOM
gridContainer.appendChild(rerollButton);

rerollButton.addEventListener('click', function() {
  diceElements.forEach((dice, i) => {
    // use the max value for the current dice from the diceMaxValues array
    let newDiceValue = Math.floor(Math.random() * diceMaxValues[i]) + 1;
    dice.textContent = newDiceValue;
    let updatedScore = calcScore();
    scoreElement.textContent = "Score: " + updatedScore;
  });
});

rerollButton.classList.add('reroll-button');


// create a new div element to display the score
const scoreElement = document.createElement('div');
// add a class name to the score element
scoreElement.classList.add('score');
// create a new span element to display the label
const labelElement = document.createElement('span');
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

const resetButton = document.createElement('button');
resetButton.textContent = 'RESET MAX VALUE AND RE-ROLL';
gridContainer.appendChild(resetButton);

resetButton.addEventListener('click', function() {
  const newDiceMaxValues = Array.from({length: 100}, () => Math.floor(Math.random() * 99) + 2);
  diceElements.forEach((dice, i) => {
    // use the new max value for the current dice from the newDiceMaxValues array
    let newDiceValue = Math.floor(Math.random() * newDiceMaxValues[i]) + 1;
    dice.textContent = newDiceValue;
  });
  let updatedScore = calcScore();
  scoreElement.textContent = "Score: " + updatedScore;
});



