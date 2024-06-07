import blackLogo from "../../img/black-bishop.png"
import whiteLogo from "../../img/white-bishop.png"
import { Colors } from "../vars"
import { FiguresType } from "../vars"
import { Figure } from "./Figure"

export class Bishop extends Figure{
    constructor(color : Colors){
        super(color);
        this.setType(FiguresType.Bishop);
        if(!color){
            this.setSrc(blackLogo);
        }else{
            this.setSrc(whiteLogo);
        }
    }
}