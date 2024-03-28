"use scrict";

console.log("Hello World");

// ********* CONTROLLER *********
let countCells = 0;

document.getElementById("difficulty").addEventListener("change", function() {
    newGame(); // Start a new game with the new difficulty
});
document.getElementById("board").addEventListener("click", function(event) {
    // Check if the clicked element is a cell
    if (event.target.classList.contains("cell")) {
        let row = parseInt(event.target.dataset.row);
        let col = parseInt(event.target.dataset.col);
        revealCell(row, col);
        checkIfGameIsWon();
    }
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

function placeFlag() {

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

function checkIfGameIsWon(){
    let cells = document.getElementsByClassName("cell");
    let mines = document.getElementsByClassName("mine");
    let cellsWithoutMines = cells.length - mines.length;
    console.log("Cells without mines:", cellsWithoutMines);
    if (countCells === cellsWithoutMines) {
        console.log("You won!");
    }
}

function resetGame(){

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


