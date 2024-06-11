import { Colors } from "./vars";
import { Figure } from "./figures/Figure";

class Cell{
    readonly color : Colors;
    readonly x : number;
    readonly y : number;
    private available : boolean = false;
    private figure : Figure | null;

    public getCopyCell() : Cell{
        let copyCell = new Cell(this.color, this.x, this.y, this.figure);
        copyCell.available = this.available;
        return copyCell;
    }

    public getColor() : Colors{
        return this.color;
    }

    public getX() : number{
        return this.x;
    }
    public getY() : number{
        return this.y;
    }

    public isAvailable() : boolean{
        return this.available;
    }
    public makeAvailable() : void{
        this.available = true;
    }
    public makeUnAvailable() : void{
        this.available = false;
    }

    public getFigure() : Figure | null{
        return this.figure;
    }
    public setFigure(figure : Figure) : void{
        this.figure = figure;
    }
    public deleteFigure() : void{
        this.figure = null;
    }

    constructor(color : Colors, x : number, y : number, figure : Figure | null = null){
        this.color = color;
        this.x = x;
        this.y = y;
        this.figure = figure;
    }
}

export default Cell;