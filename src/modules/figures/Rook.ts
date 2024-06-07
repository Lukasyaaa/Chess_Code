import blackLogo from "../../img/black-rook.png"
import whiteLogo from "../../img/white-rook.png"
import { Colors } from "../vars"
import { FiguresType } from "../vars"
import { Figure } from "./Figure"

export class Rook extends Figure{
    constructor(color : Colors){
        super(color);
        this.setType(FiguresType.Rook);
        if(!color){
            this.setSrc(blackLogo);
        }else{
            this.setSrc(whiteLogo);
        }
    }
}