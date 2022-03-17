const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export default class Grid {
    // establish the consructor for a grid element
    constructor(gridElement) {
        // now create the grid and set/assign CSS properties
        gridElement.style.setProperty("--grid-size", GRID_SIZE);
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

        // create an individual cell
        createCellElements(gridElement);
    }
}

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
