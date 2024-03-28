"use scrict";

console.log("Hello World");

// ********* CONTROLLER *********

document.getElementById("board").addEventListener("click", function(event) {
    // Check if the clicked element is a cell
    if (event.target.classList.contains("cell")) {
        let row = parseInt(event.target.dataset.row);
        let col = parseInt(event.target.dataset.col);
        revealCell(row, col);
        revealNeighborCellsWithZero(row, col);
    }
});
function revealCell(row, col) {
    let cell = getCell(row, col);
    if (cell.classList.contains("mine")) {
        cell.backgroundColor = "red";
        console.log("Game over");
    } else {
        cell.classList.add("revealed");
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
    /*
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        if (parseInt(cell.dataset.row) === row && parseInt(cell.dataset.col) === col) {
            return cell;
        }
    }
    return null;
     */
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function revealNeighborCellsWithZero(row, col) {
    let neighborCells = getNeighborCells(row, col);
    for (let i = 0; i < neighborCells.length; i++) {
        let neighborCell = neighborCells[i];
        // Ensure the cell hasn't already been revealed
        if (!neighborCell.classList.contains("revealed")) {
            // Reveal this neighbor cell
            neighborCell.classList.add("revealed");
            // If the neighbor cell is marked with "0", recursively reveal its neighbors
            if (neighborCell.innerHTML === "0") {
                let neighborRow = parseInt(neighborCell.dataset.row);
                let neighborCol = parseInt(neighborCell.dataset.col);
                revealNeighborCellsWithZero(neighborRow, neighborCol);
            }
        }
    }
}

createBoard(10, 20);
checkNeighborCellsForMines();

// ********* MODEL *********







// ********* VIEW *********

function createBoard(size, mines) {
    let board = document.getElementById("board");
    board.innerHTML = "";
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

}


