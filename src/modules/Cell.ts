import { Colors } from "./vars/Colors";
import { Figure } from "./figures/Figure";
import Board from "./Board";

class Cell{
    readonly board : Board;
    readonly color : Colors;
    readonly x : number;
    readonly y : number;
    private figure : Figure | null;


    public getColor() : Colors{
        return this.color;
    }

    public getX() : number{
        return this.x;
    }
    public getY() : number{
        return this.y;
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

    constructor(board : Board, color : Colors, x : number, y : number, figure : Figure | null = null){
        this.board = board;
        this.color = color;
        this.x = x;
        this.y = y;
        this.figure = figure;
    }
}

export default Cell;