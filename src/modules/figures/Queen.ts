import blackLogo from "../../img/black-queen.png"
import whiteLogo from "../../img/white-queen.png"
import Cell from "../Cell"
import { Colors } from "../vars/Colors"
import { FiguresType } from "../vars/FiguresType"
import { Figure } from "./Figure"

export class Queen extends Figure{
    constructor(color : Colors, cell : Cell){
        super(color, cell);
        this.setType(FiguresType.Queen);
        if(!color){
            this.setSrc(blackLogo);
        }else{
            this.setSrc(whiteLogo);
        }
    }
}