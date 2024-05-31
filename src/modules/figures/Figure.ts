import Cell from "../Cell";
import { Colors } from "../vars/Colors";
import { FiguresType } from "../vars/FiguresType";

export class Figure{
    private color : Colors;
    private type : FiguresType = FiguresType.Default; 
    private src : string = "";
    private cell : Cell;

    public setType(type : FiguresType) : void{
        this.type = type;
    }
    public getType() : FiguresType{
        return this.type;
    }

    public setColor(color : Colors) : void{
        this.color = color;
    }
    public getColor() : Colors{
        return this.color;
    }

    public setCell(cell : Cell) : void{
        this.cell = cell;
    }
    public getCell() : Cell{
        return this.cell;
    }

    public setSrc(src : string) : void{
        this.src = src;
    }
    public getSrc() : string{
        return this.src;
    }

    constructor(color : Colors, cell : Cell){
        this.color = color;
        this.cell = cell;
        this.cell.setFigure(this);
    }
}