document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('grid');
    let selectedTile = null;
    let score = 0; // Global score variable
    const letterDistribution = 'AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ';

// WORD LIST STUFF ---------------------------------------------------    
    
fetch('http://crossorigin.me/https://github.com/frank-o-lantz/frank-o-lantz.github.io/blob/main/words.txt')
    .then(response => response.text())
    .then(text => {
        const wordList = new Set(text.split('\n').map(word => word.trim()));
        // Now you have your words in the wordList set
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
            let word = line.substring(start, end);
            if (wordList.has(word)) {
                highlightWord(start, end, offset, isRow, gridSize);
            }
        }
    }
}

function highlightWord(start, end, offset, isRow, gridSize) {
    for (let i = start; i < end; i++) {
        let cellIndex = isRow ? offset * gridSize + i : i * gridSize + offset;
        let cell = document.getElementById(`cell-${cellIndex}`);
        cell.classList.add('word-selected');
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
    
    
    // Handle cell click
    function cellClicked(index, event) {
        let cell = document.getElementById(`cell-${index}`);
        
        // CTRL+click to toggle red highlight
        if (event.ctrlKey && cell.textContent) {
            cell.classList.toggle('word-selected');
            return;
        }
        
        // Logic for removing and scoring red-highlighted tiles
        // This should be checked before the regular tile selection logic
        if (cell.classList.contains('word-selected')) {
        let score = removeConnectedTilesAndCalculateScore(index);
        console.log("Score increased by:", score);
        return; // Return early to avoid applying selection highlight
    }
        
        if (cell.textContent) {
            if (selectedTile === cell) {
                cell.classList.remove('selected');
                selectedTile = null;
            } else {
                if (selectedTile) selectedTile.classList.remove('selected');
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
                addRandomTiles(4); // Add new random tiles
                highlightValidWords(); // check for valid words   
        
            }
        }
        
        if (cell.classList.contains('word-selected')) {
        let score = removeConnectedTilesAndCalculateScore(index);
        // TODO: Update the actual score display
        console.log("Score increased by:", score);
    }
        
        
    }

    
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
    let scoreIncrease = tilesToRemove.length ** 2; // Score = number of tiles squared

    tilesToRemove.forEach(index => {
        let cell = document.getElementById(`cell-${index}`);
        cell.textContent = '';
        cell.classList.remove('word-selected');
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
