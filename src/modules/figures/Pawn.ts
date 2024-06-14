import blackLogo from "../../img/black-pawn.png"
import whiteLogo from "../../img/white-pawn.png"
import { Colors, FiguresType } from "../vars"
import { Figure } from "./Figure"

export class Pawn extends Figure{
    constructor(color : Colors){
        super(color);
        this.setType(FiguresType.Pawn);
        if(!color){
            this.setSrc(blackLogo);
        }else{
            this.setSrc(whiteLogo);
        }
    }
}