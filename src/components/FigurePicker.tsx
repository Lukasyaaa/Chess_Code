import React, { FC } from "react";
import queenLogo from "../img/white-queen.png"
import knightLogo from "../img/white-knight.png"
import rookLogo from "../img/white-rook.png"
import bishopLogo from "../img/white-bishop.png"
import { FiguresType } from "../modules/vars/FiguresType";


interface FigurePickerProps{
    setFigure : (newValue : FiguresType) => void;
    setWindowState : (newValue : boolean) => void;
}

export const FigurePicker : FC<FigurePickerProps> = ({setFigure, setWindowState}) =>{
    const clickLink = (e : React.MouseEvent<HTMLUListElement>) =>{
        let clicked : any = e.target;
        while(!clicked.hasAttribute("data-type")){
            clicked = clicked.parentNode;
        }
        const clickedFigure : FiguresType = clicked.getAttribute("data-type");
        setFigure(clickedFigure);
        setWindowState(false);
    } 

    return(
        <div className="choose-figure">
            <h2 className="choose-figure__heading">Choose new Shape</h2>
            <ul className="choose-figure__list" onClick={(e) => clickLink(e)}>
                <li data-id="0" data-type={FiguresType.Queen} className="choose-figure__link _active">
                    <button type="button">
                        <img src={queenLogo} alt="Queen" />
                        <span>Queen</span>
                    </button>
                </li>
                <li data-id="1" data-type={FiguresType.Knight} className="choose-figure__link">
                    <button type="button">
                        <img src={knightLogo} alt="Knight" />
                        <span>Knight</span>
                    </button>
                </li>
                <li data-id="2" data-type={FiguresType.Rook} className="choose-figure__link">
                    <button type="button">
                        <img src={rookLogo} alt="Rook" />
                        <span>Rook</span>
                    </button>
                </li>
                <li data-id="3" data-type={FiguresType.Bishop} className="choose-figure__link">
                    <button type="button">
                        <img src={bishopLogo} alt="Bishop" />
                        <span>Bishop</span>
                    </button>
                </li>
            </ul>
        </div>
    )
}