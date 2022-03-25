import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("gameBoard");

// create a grid instance
const grid = new Grid(gameBoard);

grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();

function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInput();
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput();
                return;
            }
            await moveDown();
            break;
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput();
                return;
            }
            await moveRight();
            break;
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput();
                return;
            }
            await moveLeft();
            break;
        default:
            setupInput();
            return;
    }

    // merge the tiles
    grid.cells.forEach((cell) => cell.mergeTiles());

    const newTile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = newTile;

    setupInput();

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            // logic to display the modal to playagain.
            var modal = document.getElementById("gameOverModal");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];
            var span2 = document.getElementsByClassName("close")[1];

            modal.style.display = "block";
            // When the user clicks on <span> (x), close the modal
            span.onclick = function () {
                modal.style.display = "none";
            };

            span2.onclick = function () {
                modal.style.display = "none";
                window.location.reload();
            };

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };
        });
        return;
    }
    setupInput();
}

function moveUp() {
    return slideTiles(grid.cellsByColumn);
}

function moveDown() {
    return slideTiles(
        grid.cellsByColumn.map((column) => [...column].reverse())
    );
}

function moveLeft() {
    return slideTiles(grid.cellsByRow);
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
    return Promise.all(
        cells.flatMap((group) => {
            const promises = [];
            // loop through the coloumn
            for (let i = 1; i < group.length; i++) {
                const cell = group[i];
                // if the cell is null....simply continue
                if (cell.tile == null) continue;
                let lastValidCell;
                // check if I can move updwards??? Check cell above
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j];
                    // if you can't move up at lest 1 tile...simply break. No need ot check anything else
                    if (!moveToCell.canAccept(cell.tile)) break;
                    lastValidCell = moveToCell;
                }
                // can we move this tile? If we can, run this code
                if (lastValidCell != null) {
                    // if we have a tile that can move....wait for transitio nto finish
                    promises.push(cell.tile.waitForTransition());
                    // do we have a tile in which we are moving into ???
                    if (lastValidCell.tile != null) {
                        // if so, set the merge tile
                        lastValidCell.mergeTile = cell.tile;
                    } else {
                        // if no tile, set it to the current tile
                        lastValidCell.tile = cell.tile;
                    }
                    cell.tile = null;
                }
            }
            return promises;
        })
    );
}

function canMoveUp() {
    return canMove(grid.cellsByColumn);
}

function canMoveDown() {
    return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
    return canMove(grid.cellsByRow);
}

function canMoveRight() {
    return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
    return cells.some((group) => {
        return group.some((cell, index) => {
            // check if we cadn move at all
            if (index === 0) return false;

            // cant move an empty c ell
            if (cell.tile == null) return false;

            // check the cell above...if okay..we can move
            const moveToCell = group[index - 1];
            return moveToCell.canAccept(cell.tile);
        });
    });
}
