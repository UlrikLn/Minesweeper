"use scrict";

console.log("Hello World");

// ********* CONTROLLER *********
let countCells = 0;


document.getElementById("difficulty").addEventListener("change", function() {
    newGame();
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
            revealNeighborCellsWithZero(row, col);
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

    let cells = Array.from(document.getElementsByClassName("cell"));
    let mineCells = cells.filter(cell => cell.classList.contains("mine"));

    for (let i = mineCells.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [mineCells[i], mineCells[j]] = [mineCells[j], mineCells[i]];
    }

    mineCells.forEach((cell, index) => {

        let randomDelay = Math.floor(Math.random() * 5000);
        setTimeout(() => {
            cell.style.backgroundColor = "red";
        }, randomDelay);
    });
    document.querySelector("#gameOver").style.display = "block";
}

function checkIfGameIsWon() {
    let cells = document.getElementsByClassName("cell");
    let mines = document.getElementsByClassName("mine");
    let cellsWithoutMines = cells.length - mines.length;
    console.log("Cells without mines:", cellsWithoutMines);
    if (countCells === cellsWithoutMines) {
        console.log("You won!");
        document.querySelector("#gameWon").style.display = "block";}
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


function minesweepSolver() {
    let cells = document.getElementsByClassName("cell");
    let mines = document.getElementsByClassName("mine");
    let safeCells = new Set();
    let bombsFound = 0;

    let continueProcessing = true;
    function solverIteration(loopIteration = 0) {
        if (safeCells.size >= (cells.length - mines.length)) {
            console.log("Solver has finished.");
            continueProcessing = false;
            document.querySelector("#gameWon").style.display = "block";
        return;
        }

        console.log("Safe cells:", safeCells.size);
        console.log("cells without bombs:", cells.length - mines.length);
        console.log("cells length:", cells.length);
        loopIteration++;
        console.log("Loop iteration:", loopIteration);
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            let row = parseInt(cell.dataset.row);
            let col = parseInt(cell.dataset.col);
            let x = parseInt(cell.innerHTML);
            let unrevealedNeighborCells = getUnrevealedNeighborCells(row, col);
            let flaggedNeighborCells = getFlaggedNeighborCells(row, col);
            
            if (row === 0 && col === 0 && cell.classList.contains("unrevealed")) {
                revealCell(row, col);
                continue;
            }

            // If the cell is unrevealed, skip it
            if (cell.classList.contains("unrevealed")) {
                continue;
            }

            // If the cell has a flag, skip it
            if (cell.classList.contains("flagged")) {
                continue;
            }

            // If the cell is safe, skip it
            if (safeCells.has(cell)) {
                continue;
            }

            // If the cell is a 0, add it to the safeCells array
            if (x === 0) {
                safeCells.add(cell);
                continue;
            }
            // If the cell has the same number of unreavealed neighbors as the cell value, flag all unrevealed neighbors
            if (cell.classList.contains("revealed") && x === unrevealedNeighborCells.length) {
                for (let j = 0; j < unrevealedNeighborCells.length; j++) {
                    let neighborCell = unrevealedNeighborCells[j];
                    if (!neighborCell.classList.contains("flagged")) {
                        neighborCell.classList.add("flagged");
                        bombsFound++;
                    }
                    safeCells.add(cell);
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
                    safeCells.add(cell);
                }
                continue;
            }
            if (loopIteration > 5) {
                let nextCellClick = findUnrevealedCell();
                if(nextCellClick.classList.contains("mine")){
                    nextCellClick.click();
                    continueProcessing = false;
                    gameOver();
                }
                nextCellClick.click();
                loopIteration = 0;
                continue;
            }
        }
        if (continueProcessing) {
            setTimeout(() => solverIteration(loopIteration + 1), 250); // Adjust the delay as needed
        } else {
            console.log("Solver has finished.");
        }
    }

    solverIteration();

}

function findUnrevealedCell(){
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        if(cell.classList.contains("unrevealed") && !cell.classList.contains("flagged")){
            return cell;
        }
    }
    return null;
}

function getFlaggedNeighborCells(row, col) {
    let flaggedNeighborCells = [];
    // Define relative positions of all possible neighbors
    const neighborPositions = [
        { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
        { dr: 0, dc: -1 },                     { dr: 0, dc: 1 },
        { dr: 1, dc: -1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }
    ];

    for (const { dr, dc } of neighborPositions) {
        const neighborRow = row + dr;
        const neighborCol = col + dc;
        const neighborCell = getCell(neighborRow, neighborCol);

        if (neighborCell && neighborCell.classList.contains("flagged")) {
            flaggedNeighborCells.push(neighborCell);
        }
    }

    return flaggedNeighborCells;
}

function getUnrevealedNeighborCells(row, col) {
    let unrevealedNeighborCells = [];
    const neighborPositions = [
        { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
        { dr: 0, dc: -1 },                     { dr: 0, dc: 1 },
        { dr: 1, dc: -1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }
    ];

    for (const { dr, dc } of neighborPositions) {
        const neighborRow = row + dr;
        const neighborCol = col + dc;
        const neighborCell = getCell(neighborRow, neighborCol);

        if (neighborCell && !neighborCell.classList.contains("revealed")) {
            unrevealedNeighborCells.push(neighborCell);
        }
    }

    return unrevealedNeighborCells;
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
        randomCell.classList.add("unrevealed");
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


