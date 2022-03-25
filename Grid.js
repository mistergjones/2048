const GRID_SIZE = 4;
const CELL_SIZE = 15;
const CELL_GAP = 1;

export default class Grid {
    // introduce a private field for this class
    #cells;

    // establish the consructor for a grid element
    constructor(gridElement) {
        // now create the grid and set/assign CSS properties
        gridElement.style.setProperty("--grid-size", GRID_SIZE);
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

        // create all the required cells and give them x & y positions also
        this.#cells = createCellElements(gridElement).map(
            (cellElement, index) => {
                return new Cell(
                    cellElement,
                    index % GRID_SIZE,
                    Math.floor(index / GRID_SIZE)
                );
            }
        );
    }

    get cells() {
        return this.#cells;
    }

    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || [];
            cellGrid[cell.x][cell.y] = cell;
            return cellGrid;
        }, []);
    }

    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell;
            return cellGrid;
        }, []);
    }

    get #emptyCells() {
        return this.#cells.filter((cell) => cell.tile == null);
    }

    // generate a random cell
    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[randomIndex];
    }
}

class Cell {
    // make the members private to this class
    #cellElement;
    #x;
    #y;
    #tile;
    #mergeTile;
    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }
    get y() {
        return this.#y;
    }

    get tile() {
        return this.#tile;
    }

    set tile(value) {
        this.#tile = value;
        if (value == null) return;

        // move fromn old position to new position
        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
    }

    get mergeTile() {
        return this.#mergeTile;
    }

    set mergeTile(value) {
        this.#mergeTile = value;
        if (value == null) return;
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }

    canAccept(tile) {
        return (
            this.tile == null ||
            (this.mergeTile == null && this.tile.value === tile.value)
        );
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return;

        this.tile.value = this.tile.value + this.mergeTile.value;

        this.mergeTile.remove();

        this.mergeTile = null;
    }
}

// Create each cell element based on the grid sizes. e.g. 4x4, 5X5
function createCellElements(gridElement) {
    const cells = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        // add the classname to the div
        cell.classList.add("cell");
        // push into the array and append it to the acutal gridElement
        cells.push(cell);
        gridElement.append(cell);
    }
    return cells;
}
