"use scrict";

console.log("Hello World");

// ********* CONTROLLER *********
let countCells = 0;

document.getElementById("difficulty").addEventListener("change", function() {
    newGame(); // Start a new game with the new difficulty
});
document.getElementById("board").addEventListener("click", function(event) {
    // Check if the clicked element is a cell
    if (event.target.classList.contains("cell") && !event.target.classList.contains("flagged")) {
        let row = parseInt(event.target.dataset.row);
        let col = parseInt(event.target.dataset.col);
        revealCell(row, col);
        checkIfGameIsWon();
    }
});

document.getElementById("cheat").addEventListener("click", function() {
    minesweepSolver();
});

document.getElementById("board").addEventListener("contextmenu", function(event) {
    event.preventDefault();
    let cell = getCell(parseInt(event.target.dataset.row), parseInt(event.target.dataset.col));
    if(!cell.classList.contains("flagged")) {
        cell.classList.add("flagged")
    } else {
        cell.classList.remove("flagged")
    }
    return false;
})

function revealCell(row, col) {
    let cell = getCell(row, col);
    if (cell.classList.contains("mine")) {
        cell.style.backgroundColor = "red";
        console.log("Game over");
        gameOver();
    } else {
        cell.classList.remove("unrevealed")
        cell.classList.add("revealed");
        countCells++;
        if (cell.innerHTML === "0") {
            revealNeighborCellsWithZero(row, col); // Only call if the cell is "0"
        }
    }
}

function checkNeighborCellsForMines(){
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        let row = parseInt(cell.dataset.row);
        let col = parseInt(cell.dataset.col);
        let neighborCells = getNeighborCells(row, col);
        let numberOfMines = 0;
        for (let j = 0; j < neighborCells.length; j++) {
            let neighborCell = neighborCells[j];
            if (neighborCell.classList.contains("mine")) {
                numberOfMines++;
            }
        }
        giveCellNumber(cell, numberOfMines);
    }
}

function getNeighborCells(row, col) {
    let cells = document.getElementsByClassName("cell");
    let neighborCells = [];
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        let neighborRow = parseInt(cell.dataset.row);
        let neighborCol = parseInt(cell.dataset.col);
        if (neighborRow === row && neighborCol === col) {
            continue;
        }
        if (neighborRow >= row - 1 && neighborRow <= row + 1 && neighborCol >= col - 1 && neighborCol <= col + 1) {
            neighborCells.push(cell);
        }
    }
    return neighborCells;
}

function getCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function revealNeighborCellsWithZero(row, col) {
    let neighborCells = getNeighborCells(row, col);
    for (let i = 0; i < neighborCells.length; i++) {
        let neighborCell = neighborCells[i];
        if (!neighborCell.classList.contains("revealed")) {
            neighborCell.classList.remove("unrevealed")
            neighborCell.classList.add("revealed");
            countCells++;
            if (neighborCell.innerHTML === "0") {
                let neighborRow = parseInt(neighborCell.dataset.row);
                let neighborCol = parseInt(neighborCell.dataset.col);
                revealNeighborCellsWithZero(neighborRow, neighborCol);
            }
        }
    }
}

function gameOver() {
    // Step 1: Filter out the cells that contain mines.
    let cells = Array.from(document.getElementsByClassName("cell"));
    let mineCells = cells.filter(cell => cell.classList.contains("mine"));

    // Step 2: Shuffle the mineCells array to randomize the order.
    for (let i = mineCells.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [mineCells[i], mineCells[j]] = [mineCells[j], mineCells[i]]; // Swap elements
    }

    // Step 3: Apply a setTimeout with a random delay for each mine.
    mineCells.forEach((cell, index) => {
        // Generate a random delay. For example, between 0 and 5000 milliseconds (5 seconds).
        let randomDelay = Math.floor(Math.random() * 5000); // Adjust max value as needed
        setTimeout(() => {
            cell.style.backgroundColor = "red";
        }, randomDelay);
    });
}

function checkIfGameIsWon() {
    let cells = document.getElementsByClassName("cell");
    let mines = document.getElementsByClassName("mine");
    let cellsWithoutMines = cells.length - mines.length;
    console.log("Cells without mines:", cellsWithoutMines);
    if (countCells === cellsWithoutMines) {
        console.log("You won!");
    }
}

function newGame(){
    let difficulty = document.getElementById("difficulty").value;
     if (difficulty === "easy") {
         createBoard(10, 10)
         checkNeighborCellsForMines();
     }
    if (difficulty === "medium") {
        createBoard(15, 30)
        checkNeighborCellsForMines();
    }
    if (difficulty === "hard") {
        createBoard(20, 50)
        checkNeighborCellsForMines();
    }
    if (difficulty === "insane") {
        createBoard(50, 500)
        checkNeighborCellsForMines();
    }

    console.log("Starting new game with difficulty:", difficulty);
}
/*
Start from first Cell and iterate until done
for cell
	if cell = 0
add cell safe array
next cell
let x = cells value
if cell > 0 || !cell marked safe
	if cell = x && has x flaggedNeighbors (mine)
		reveal all unflaggedNeighbors
	if cell = x && has x unrevealedNeighbors
		flag all unrevealedNeighbors && unflaggedNeighbors
	if cell = x && x > unrevealedNeighbors
		next cell
if no possible moves reveal next cell



function minesweepSolver() {
    let cells = Array.from(document.getElementsByClassName("cell"));
    let index = 0; // Keep track of the current cell being processed
    let safeCells = []; // Store safe cells to avoid reprocessing them

    function processNextCell() {
        // Base case: stop if all cells have been processed or if the condition to stop is met
        if (index >= cells.length || countCells >= cells.length) {
            console.log("Finished processing all cells or game condition met.");
            return;
        }

        while (countCells < cells.length) {
            for (let i = 0; i < cells.length; i++) {
                let cell = cells[i];
                let row = parseInt(cell.dataset.row);
                let col = parseInt(cell.dataset.col);
                let x = parseInt(cell.innerHTML);
                let unrevealedNeighborCells = getUnrevealedNeighborCells(row, col);
                let flaggedNeighborCells = getFlaggedNeighborCells(row, col);


                if(row === 0 && col === 0 && cell.classList.contains("unrevealed")){
                    revealCell(row, col);
                    continue;
                }

                if(cell.classList.contains("unrevealed")){
                    continue;
                }

                // If the cell has a flag, skip it
                if (cell.classList.contains("flagged")){
                    continue;
                }

                // If the cell is safe, skip it
                if (safeCells.includes(cell)) {
                    continue;
                }

                // If the cell is a 0, add it to the safeCells array
                if (x === 0) {
                    safeCells.push(cell);
                    continue;
                }
                // If the cell has the same number of unreavealed neighbors as the cell value, flag all unrevealed neighbors
                if (cell.classList.contains("revealed") && x === unrevealedNeighborCells.length) {
                    for (let j = 0; j < unrevealedNeighborCells.length; j++) {
                        let neighborCell = unrevealedNeighborCells[j];
                        if (!neighborCell.classList.contains("flagged")) {
                            neighborCell.classList.add("flagged");
                        }
                        safeCells.push(cell);
                    }
                    continue;
                }
                // If the cell has the same number of flagged neighbors as the cell value, reveal all unflagged neighbors
                if (cell.classList.contains("revealed") && x === flaggedNeighborCells.length) {
                    for (let j = 0; j < unrevealedNeighborCells.length; j++) {
                        let neighborCell = unrevealedNeighborCells[j];
                        if (!neighborCell.classList.contains("flagged")) {
                            revealCell(parseInt(neighborCell.dataset.row), parseInt(neighborCell.dataset.col));
                        }
                        safeCells.push(cell);
                    }
                    continue;
                }

                // if stuck, reveal nextCell
                if (i === cells.length - 1) {
                    for (let j = 0; j < cells.length; j++) {
                        let nextCell = cells[j];
                        let nextRow = parseInt(nextCell.dataset.row);
                        let nextCol = parseInt(nextCell.dataset.col);
                        if (nextCell.classList.contains("unrevealed")) {
                            revealCell(nextRow, nextCol);
                            break;
                        }
                    }
                }
            }
        }
        console.log(`Processing cell at row ${row}, col ${col}`);

        index++; // Move to the next cell
        setTimeout(processNextCell, 100); // Wait 100ms before processing the next cell
    }

    processNextCell(); // Start processing cells
}

 */


function minesweepSolver() {
    let cells = Array.from(document.getElementsByClassName("cell"));
    let safeCells = []; // Store safe cells to avoid reprocessing them
    let index = 0; // Initialize index for the asynchronous loop

    function processCellAsync() {
        // Stop condition for the recursion
        if (index >= cells.length) {
            console.log("Finished processing all cells.");
            return;
        }

        let cell = cells[index];
        let row = parseInt(cell.dataset.row);
        let col = parseInt(cell.dataset.col);

        // Only process if cell is not revealed or flagged
        if (!cell.classList.contains("revealed") && !cell.classList.contains("flagged")) {
            // Your existing logic to determine if a cell should be revealed or flagged
            processCell(row, col);
        }

        index++; // Move to the next cell
        setTimeout(processCellAsync, 0); // Schedule the next call
    }

    // Function that encapsulates your cell processing logic
    function processCell(row, col) {
        let cell = cells.find(c => parseInt(c.dataset.row) === row && parseInt(c.dataset.col) === col);
        if (!cell || safeCells.includes(cell)) return;

        let x = parseInt(cell.innerText || "0", 10);
        let unrevealedNeighborCells = getUnrevealedNeighborCells(row, col);
        let flaggedNeighborCells = getFlaggedNeighborCells(row, col);

        // Logic to reveal or flag cells based on your criteria
        if (cell.classList.contains("unrevealed") && x === 0) {
            revealCell(row, col); // Make sure this function handles asynchronous updates appropriately
            safeCells.push(cell); // Mark cell as processed
        }
        if(cell.classList.contains("unrevealed")){
        }

        // If the cell has a flag, skip it
        if (cell.classList.contains("flagged")){
        }

        // If the cell is safe, skip it
        if (safeCells.includes(cell)) {
        }

        // If the cell is a 0, add it to the safeCells array
        if (x === 0) {
            safeCells.push(cell);
        }
        // If the cell has the same number of unreavealed neighbors as the cell value, flag all unrevealed neighbors
        if (cell.classList.contains("revealed") && x === unrevealedNeighborCells.length) {
            for (let j = 0; j < unrevealedNeighborCells.length; j++) {
                let neighborCell = unrevealedNeighborCells[j];
                if (!neighborCell.classList.contains("flagged")) {
                    neighborCell.classList.add("flagged");
                }
                safeCells.push(cell);
            }
        }
        // If the cell has the same number of flagged neighbors as the cell value, reveal all unflagged neighbors
        if (cell.classList.contains("revealed") && x === flaggedNeighborCells.length) {
            for (let j = 0; j < unrevealedNeighborCells.length; j++) {
                let neighborCell = unrevealedNeighborCells[j];
                if (!neighborCell.classList.contains("flagged")) {
                    revealCell(parseInt(neighborCell.dataset.row), parseInt(neighborCell.dataset.col));
                }
                safeCells.push(cell);
            }
        }

        // if stuck, reveal nextCell
        if (i === cells.length - 1) {
            for (let j = 0; j < cells.length; j++) {
                let nextCell = cells[j];
                let nextRow = parseInt(nextCell.dataset.row);
                let nextCol = parseInt(nextCell.dataset.col);
                if (nextCell.classList.contains("unrevealed")) {
                    revealCell(nextRow, nextCol);
                    break;
                }
            }
        }
    }

    processCellAsync(); // Start processing cells asynchronously
}


function getFlaggedNeighborCells(row, col) {
    let flaggedNeighborCells = [];
    // Define relative positions of all possible neighbors
    const neighborPositions = [
        { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
        { dr: 0, dc: -1 },                     { dr: 0, dc: 1 },
        { dr: 1, dc: -1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }
    ];

    // Iterate over all possible neighbor positions
    for (const { dr, dc } of neighborPositions) {
        const neighborRow = row + dr;
        const neighborCol = col + dc;
        const neighborCell = getCell(neighborRow, neighborCol);

        // Check if the neighbor cell exists and is flagged
        if (neighborCell && neighborCell.classList.contains("flagged")) {
            flaggedNeighborCells.push(neighborCell);
        }
    }

    return flaggedNeighborCells;
}

// Use the function for unrevealed neighbors
function getUnrevealedNeighborCells(row, col) {
    let unrevealedNeighborCells = [];
    // Define relative positions of all possible neighbors
    const neighborPositions = [
        { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
        { dr: 0, dc: -1 },                     { dr: 0, dc: 1 },
        { dr: 1, dc: -1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }
    ];

    // Iterate over all possible neighbor positions
    for (const { dr, dc } of neighborPositions) {
        const neighborRow = row + dr;
        const neighborCol = col + dc;
        const neighborCell = getCell(neighborRow, neighborCol);

        // Check if the neighbor cell exists and is unrevealed
        if (neighborCell && !neighborCell.classList.contains("revealed")) {
            unrevealedNeighborCells.push(neighborCell);
        }
    }

    return unrevealedNeighborCells;
}

/*

function getFlaggedNeighborCells(row, col){
    let cells = document.getElementsByClassName("cell");
    let flaggedNeighborCells = [];
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        let neighborRow = parseInt(cell.dataset.row);
        let neighborCol = parseInt(cell.dataset.col);
        if (neighborRow === row && neighborCol === col) {
            continue;
        }
        if (neighborRow >= row - 1 && neighborRow <= row + 1 && neighborCol >= col - 1 && neighborCol <= col + 1 && getCell(neighborRow, neighborCol).classList.contains("flagged")) {
            flaggedNeighborCells.push(cell);
        }
    }
    return flaggedNeighborCells;
}

function getUnrevealedNeighborCells(row, col){
    let cells = document.getElementsByClassName("cell");
    let unrevealedNeighborCells = [];
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        let neighborRow = parseInt(cell.dataset.row);
        let neighborCol = parseInt(cell.dataset.col);
        if (neighborRow === row && neighborCol === col) {
            continue;
        }
        if (neighborRow >= row - 1 && neighborRow <= row + 1 && neighborCol >= col - 1 && neighborCol <= col + 1 && getCell(neighborRow, neighborCol).classList.contains("unrevealed")) {
            unrevealedNeighborCells.push(cell);
        }
    }
    return unrevealedNeighborCells;
}

 */

// ********* MODEL *********







// ********* VIEW *********

function createBoard(size, mines) {
    countCells = 0;
    let board = document.getElementById("board");
    board.innerHTML = "";
    adjustBoardSize(size, size);
    for (let i = 0; i < size; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < size; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            row.appendChild(cell);
        }
        board.appendChild(row);
    };
    populateBoardWithMines(mines);
}

function populateBoardWithMines(mines){
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < mines; i++) {
        let randomCell = cells[Math.floor(Math.random() * cells.length)];
        randomCell.classList.add("mine");
    }
}

function giveCellNumber(cell,number){
    if (cell.classList.contains("mine")) {
        return;
    }
    cell.innerHTML = number > 0 ? number : "0";
    cell.classList.add("unrevealed");
}

function adjustBoardSize(rows, cols) {
    const board = document.getElementById('board');
    // Keep the cell size constant, only adjust the number of rows and columns
    board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    board.style.gridTemplateRows = `repeat(${rows}, 30px)`;
}


