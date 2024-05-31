import blackLogo from "../../img/black-king.png"
import whiteLogo from "../../img/white-king.png"
import Cell from "../Cell"
import { Colors } from "../vars/Colors"
import { FiguresType } from "../vars/FiguresType"
import { Figure } from "./Figure"

export class King extends Figure{
    constructor(color : Colors, cell : Cell){
        super(color, cell);
        this.setType(FiguresType.King);
        if(!color){
            this.setSrc(blackLogo);
        }else{
            this.setSrc(whiteLogo);
        }
    }
}