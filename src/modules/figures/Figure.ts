import Cell from "../Cell";
import { Colors } from "../vars/Colors";
import { FiguresType } from "../vars/FiguresType";

export class Figure{
    private color : Colors;
    private type : FiguresType = FiguresType.Default; 
    private src : string = "";

    public getCopy() : Figure{
        let copyFigure : Figure = new Figure(this.color);
        copyFigure.type = this.type;
        copyFigure.src = this.src;
        return copyFigure; 
    }

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


    public setSrc(src : string) : void{
        this.src = src;
    }
    public getSrc() : string{
        return this.src;
    }

    constructor(color : Colors){
        this.color = color;
    }
}