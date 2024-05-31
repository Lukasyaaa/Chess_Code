import blackLogo from "../../img/black-knight.png"
import whiteLogo from "../../img/white-knight.png"
import Cell from "../Cell"
import { Colors } from "../vars/Colors"
import { FiguresType } from "../vars/FiguresType"
import { Figure } from "./Figure"

export class Knight extends Figure{
    constructor(color : Colors, cell : Cell){
        super(color, cell);
        this.setType(FiguresType.Knight);
        if(!color){
            this.setSrc(blackLogo);
        }else{
            this.setSrc(whiteLogo);
        }
    }
}