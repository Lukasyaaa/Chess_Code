import Cell from "../Cell";
import { Colors, FiguresType } from "../vars";

export class Figure{
    private color : Colors;
    private type : FiguresType = FiguresType.Default; 
    private src : string = "";

    constructor(color : Colors){
        this.color = color;
    }

    public getCopy() : Figure{
        let copyFigure : Figure = new Figure(this.color);
        copyFigure.type = this.type;
        copyFigure.src = this.src;
        return copyFigure; 
    }

    public getType() : FiguresType{
        return this.type;
    }
    public getColor() : Colors{
        return this.color;
    }
    public getSrc() : string{
        return this.src;
    }

    public setType(type : FiguresType) : void{
        this.type = type;
    }
    public setColor(color : Colors) : void{
        this.color = color;
    }
    public setSrc(src : string) : void{
        this.src = src;
    }
}