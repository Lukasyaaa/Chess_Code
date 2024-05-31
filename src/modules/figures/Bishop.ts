import blackLogo from "../../img/black-bishop.png"
import whiteLogo from "../../img/white-bishop.png"
import Cell from "../Cell"
import { Colors } from "../vars/Colors"
import { FiguresType } from "../vars/FiguresType"
import { Figure } from "./Figure"

export class Bishop extends Figure{
    constructor(color : Colors, cell : Cell){
        super(color, cell);
        this.setType(FiguresType.Bishop);
        if(!color){
            this.setSrc(blackLogo);
        }else{
            this.setSrc(whiteLogo);
        }
    }
}