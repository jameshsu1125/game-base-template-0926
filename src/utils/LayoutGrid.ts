export class LayoutGrid {
    private gridWidth: number;
    private gridHeight: number;
    private cellWidth: number;
    private cellHeight: number;
    private columns: number;
    private rows: number;

    constructor(
        screenWidth: number,
        screenHeight: number,
        columns: number = 12,
        rows: number = 12
    ) {
        this.gridWidth = screenWidth;
        this.gridHeight = screenHeight;
        this.columns = columns;
        this.rows = rows;
        this.cellWidth = screenWidth / columns;
        this.cellHeight = screenHeight / rows;
    }

    /**
     * Get the position of a specific grid cell
     * @param column - Column index (0-based)
     * @param row - Row index (0-based)
     * @returns Position object with x and y coordinates
     */
    public getCellPosition(
        column: number,
        row: number
    ): { x: number; y: number } {
        return {
            x: column * this.cellWidth,
            y: row * this.cellHeight,
        };
    }

    /**
     * Get the position of a cell's center
     * @param column - Column index (0-based)
     * @param row - Row index (0-based)
     * @returns Center position object with x and y coordinates
     */
    public getCellCenter(
        column: number,
        row: number
    ): { x: number; y: number } {
        return {
            x: column * this.cellWidth + this.cellWidth / 2,
            y: row * this.cellHeight + this.cellHeight / 2,
        };
    }

    /**
     * Get dimensions for elements spanning multiple cells
     * @param columnSpan - Number of columns to span
     * @param rowSpan - Number of rows to span
     * @returns Dimensions object with width and height
     */
    public getSpanDimensions(
        columnSpan: number,
        rowSpan: number
    ): { width: number; height: number } {
        return {
            width: columnSpan * this.cellWidth,
            height: rowSpan * this.cellHeight,
        };
    }

    /**
     * Get the grid cell that contains a specific position
     * @param x - X coordinate
     * @param y - Y coordinate
     * @returns Grid cell coordinates
     */
    public getGridCell(x: number, y: number): { column: number; row: number } {
        return {
            column: Math.floor(x / this.cellWidth),
            row: Math.floor(y / this.cellHeight),
        };
    }

    /**
     * Get grid information
     * @returns Object with grid dimensions and cell sizes
     */
    public getGridInfo(): {
        width: number;
        height: number;
        cellWidth: number;
        cellHeight: number;
        columns: number;
        rows: number;
    } {
        return {
            width: this.gridWidth,
            height: this.gridHeight,
            cellWidth: this.cellWidth,
            cellHeight: this.cellHeight,
            columns: this.columns,
            rows: this.rows,
        };
    }

    /**
     * Update grid dimensions (useful for responsive layouts)
     * @param screenWidth - New screen width
     * @param screenHeight - New screen height
     */
    public updateDimensions(screenWidth: number, screenHeight: number): void {
        this.gridWidth = screenWidth;
        this.gridHeight = screenHeight;
        this.cellWidth = screenWidth / this.columns;
        this.cellHeight = screenHeight / this.rows;
    }
}
