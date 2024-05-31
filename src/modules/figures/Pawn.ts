import blackLogo from "../../img/black-pawn.png"
import whiteLogo from "../../img/white-pawn.png"
import Cell from "../Cell"
import { Colors } from "../vars/Colors"
import { FiguresType } from "../vars/FiguresType"
import { Figure } from "./Figure"

export class Pawn extends Figure{
    constructor(color : Colors, cell : Cell){
        super(color, cell);
        this.setType(FiguresType.Pawn);
        if(!color){
            this.setSrc(blackLogo);
        }else{
            this.setSrc(whiteLogo);
        }
    }
}