import blackLogo from "../../img/black-knight.png"
import whiteLogo from "../../img/white-knight.png"
import { Colors, FiguresType } from "../vars"
import { Figure } from "./Figure"

export class Knight extends Figure{
    constructor(color : Colors){
        super(color);
        this.setType(FiguresType.Knight);
        if(!color){
            this.setSrc(blackLogo);
        }else{
            this.setSrc(whiteLogo);
        }
    }
}