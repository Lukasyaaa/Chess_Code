import blackLogo from "../../img/black-queen.png"
import whiteLogo from "../../img/white-queen.png"
import { Colors, FiguresType } from "../vars"
import { Figure } from "./Figure"

export class Queen extends Figure{
    constructor(color : Colors){
        super(color);
        this.setType(FiguresType.Queen);
        if(!color){
            this.setSrc(blackLogo);
        }else{
            this.setSrc(whiteLogo);
        }
    }
}