document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('grid');
    let selectedTile = null;
    let score = 0; // Global score variable
    let newTileAmount = 3;
    let newTileAmountCounter = 0;
    const letterDistribution = 'AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ';

// WORD HIGHLIGHT COLORS ---------------------------------------------
    
const colors = [
    'rgba(255, 0, 0, 0.5)', // Red with 50% opacity
    'rgba(0, 255, 0, 0.5)', // Green with 50% opacity
    'rgba(0, 0, 255, 0.5)', // Blue with 50% opacity
    'rgba(127, 127, 0, 0.5)',
    'rgba(127, 0, 127, 0.5)',
    'rgba(0, 127, 127, 0.5)',
    'rgba(150, 60, 50, 0.5)',
    'rgba(60, 150, 50, 0.5)',
    'rgba(60, 50, 150, 0.5)',
    'rgba(120, 85, 45, 0.5)',
    'rgba(120, 45, 85, 0.5)',
    'rgba(85, 120, 45, 0.5)',
    'rgba(45, 120, 85, 0.5)',
    'rgba(85, 45, 120, 0.5)',
    'rgba(45, 85, 120, 0.5)',
];   
    
let wordColors = {}; // Object to store word positions and their assigned colors
    
    
    
// WORD LIST STUFF ---------------------------------------------------    
    
let wordList = new Set(); // Define wordList in the global scope

fetch('https://raw.githubusercontent.com/frank-o-lantz/frank-o-lantz.github.io/main/words.txt')
    .then(response => response.text())
    .then(text => {
        text.split('\n').map(word => wordList.add(word.trim()));
        // Now you have your words in the wordList set
        highlightValidWords(); // Call this here to ensure wordList is loaded
    })
    .catch(error => console.error('Error loading word list:', error));


//WORD SELECTION -------------------------------------------------------

function highlightValidWords(gridSize = 10) {
    // Scan each row
    for (let row = 0; row < gridSize; row++) {
        checkAndHighlightWords(getRowLetters(row, gridSize), row, true, gridSize);
    }

    // Scan each column
    for (let col = 0; col < gridSize; col++) {
        checkAndHighlightWords(getColumnLetters(col, gridSize), col, false, gridSize);
    }
}

function getRowLetters(row, gridSize) {
    let letters = '';
    for (let col = 0; col < gridSize; col++) {
        let cell = document.getElementById(`cell-${row * gridSize + col}`);
        letters += cell.textContent || ' ';
    }
    return letters;
}

function getColumnLetters(col, gridSize) {
    let letters = '';
    for (let row = 0; row < gridSize; row++) {
        let cell = document.getElementById(`cell-${row * gridSize + col}`);
        letters += cell.textContent || ' ';
    }
    return letters;
}

function checkAndHighlightWords(line, offset, isRow, gridSize) {
    for (let start = 0; start < line.length; start++) {
        for (let end = start + 3; end <= line.length; end++) {
            let word = line.substring(start, end).toLowerCase(); // Convert to lowercase
            if (wordList.has(word)) {
                highlightWord(start, end, offset, isRow, gridSize);
            }
        }
    }
}

let currentColorIndex = 0    
    
function highlightWord(start, end, offset, isRow, gridSize) {
    const wordKey = `${start}-${end}-${offset}-${isRow}`;
    let color;

    if (wordColors[wordKey]) {
        color = wordColors[wordKey]; // Use existing color
    } else {
        color = colors[currentColorIndex % colors.length];
        currentColorIndex++;
        wordColors[wordKey] = color; // Store color for this word
    }

    for (let i = start; i < end; i++) {
        let cellIndex = isRow ? offset * gridSize + i : i * gridSize + offset;
        let cell = document.getElementById(`cell-${cellIndex}`);
        cell.style.backgroundColor = color;
        cell.classList.add('word-selected'); // Add the 'word-selected' class
    }
}


    
    
    
//----------------------------------------------------------------------    
    

    // Create the 10x10 grid
    for (let i = 0; i < 100; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `cell-${i}`;
        cell.onclick = (event) => cellClicked(i, event);
        gridElement.appendChild(cell);
    }

    // Place some random letters
    for (let i = 0; i < 30; i++) {
        let randomCellIndex = Math.floor(Math.random() * 100);
        let randomCell = document.getElementById(`cell-${randomCellIndex}`);
        if (!randomCell.textContent) {
            randomCell.textContent = getRandomLetter();
        } else {
            i--; // If the cell is already filled, repeat this iteration
        }
        
    }

 highlightValidWords();   
    
    
    // Handle cell click------------------------------------------------------
    
    function cellClicked(index, event) {
    let cell = document.getElementById(`cell-${index}`);

    // CTRL+click to toggle red highlight
    if (event.ctrlKey && cell.textContent) {
        cell.classList.toggle('word-selected');
        return;
    }

    // Check if the click is for scoring a word
    if (cell.classList.contains('word-selected')) {
        console.log("Highlighted Word Clicked");
        let scoreIncrease = removeConnectedTilesAndCalculateScore(index);
        console.log("Score increased by:", scoreIncrease);
        highlightValidWords(); // Update word highlights after scoring
        return;
    }

    // Click on the currently selected tile to deselect it
    if (selectedTile && selectedTile === cell) {
        selectedTile.classList.remove('selected');
        selectedTile = null;
        return;
    }    
        
        
    // Regular click logic for tile selection and movement
    if (cell.textContent && !selectedTile) {
        if (selectedTile === cell) {
            cell.classList.remove('selected');
            selectedTile = null;
        } else {
            selectedTile = cell;
            cell.classList.add('selected');
        }
    } else if (selectedTile) {
        // Check if a path is available
        let grid = document.querySelectorAll('.cell');
        if (isPathAvailable(grid, parseInt(selectedTile.id.split('-')[1]), index)) {
            cell.textContent = selectedTile.textContent;
            selectedTile.textContent = '';
            selectedTile.classList.remove('selected');
            selectedTile = null;
            addRandomTiles(newTileAmount); // Add new random tiles
            newTileAmountCounter++;
            if (newTileAmountCounter >= 10) {
                newTileAmount++;
                newTileAmountCounter = 0;
            }
            highlightValidWords(); // check for valid words

            // Clear selectedTile to prevent further actions on it
            selectedTile = null;
        }
    }
}


    //------------------------------------------------------------
    
    function isPathAvailable(grid, start, target) {
        const rows = 10;
        const cols = 10;
        const visited = new Set();
        const queue = [start];

        while (queue.length > 0) {
            let current = queue.shift();
            if (current === target) {
                return true;
            }

            visited.add(current);

            // Get neighbors (up, down, left, right)
            const [row, col] = [Math.floor(current / cols), current % cols];
            const neighbors = [
                row > 0 ? current - cols : null,             // up
                row < rows - 1 ? current + cols : null,      // down
                col > 0 ? current - 1 : null,                // left
                col < cols - 1 ? current + 1 : null          // right
            ];

            for (let neighbor of neighbors) {
                if (neighbor !== null && !visited.has(neighbor) && !grid[neighbor].textContent) {
                    queue.push(neighbor);
                }
            }
        }

        return false;
    }
    
    function addRandomTiles(numTiles) {
    let emptyCells = [];
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        if (!cell.textContent) {
            emptyCells.push(index);
        }
    });

    for (let i = 0; i < numTiles; i++) {
        if (emptyCells.length === 0) break; // Exit if no empty cells are left
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        let cellIndex = emptyCells[randomIndex];
        let randomCell = document.getElementById(`cell-${cellIndex}`);
        randomCell.textContent = getRandomLetter();
        
         // Add the 'highlight' class to the new tile
        randomCell.classList.add('highlight');

        // Remove the 'highlight' class after the animation duration
        setTimeout(() => {
            randomCell.classList.remove('highlight');
        }, 2000);
        
        emptyCells.splice(randomIndex, 1); // Remove the filled cell from the empty list
        
    }
        
}

    function removeConnectedTilesAndCalculateScore(startIndex) {
    let tilesToRemove = getConnectedWordTiles(startIndex);
    let scoreIncrease = tilesToRemove.length ** 2;

    tilesToRemove.forEach(index => {
        let cell = document.getElementById(`cell-${index}`);
        cell.textContent = ''; // Remove the letter
        cell.style.backgroundColor = ''; // Reset background color
        cell.classList.remove('word-selected'); // Remove the highlight class

        // Remove the word from the wordColors map if necessary
        // ...
    });

    score += scoreIncrease;
    updateScoreDisplay();
    return scoreIncrease;
}


    function updateScoreDisplay() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

    
    function getConnectedWordTiles(startIndex) {
    const connectedTiles = [];
    const rows = 10;
    const cols = 10;
    const visited = new Set();
    const queue = [startIndex];

    while (queue.length > 0) {
        let current = queue.shift();

        if (!visited.has(current)) {
            visited.add(current);
            let currentCell = document.getElementById(`cell-${current}`);

            // Check if the current cell is word-selected
            if (currentCell && currentCell.classList.contains('word-selected')) {
                connectedTiles.push(current);

                // Get neighbors (up, down, left, right)
                const [row, col] = [Math.floor(current / cols), current % cols];
                const neighbors = [
                    row > 0 ? current - cols : null,             // up
                    row < rows - 1 ? current + cols : null,      // down
                    col > 0 ? current - 1 : null,                // left
                    col < cols - 1 ? current + 1 : null          // right
                ];

                for (let neighbor of neighbors) {
                    if (neighbor !== null && !visited.has(neighbor)) {
                        queue.push(neighbor);
                    }
                }
            }
        }
    }

    return connectedTiles;
}
 
    function getRandomLetter() {
    let randomIndex = Math.floor(Math.random() * letterDistribution.length);
    return letterDistribution[randomIndex];
} 
    
    
    
});
