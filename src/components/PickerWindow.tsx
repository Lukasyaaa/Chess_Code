import React, { FC } from "react";
import queenLogo from "../img/white-queen.png"
import knightLogo from "../img/white-knight.png"
import rookLogo from "../img/white-rook.png"
import bishopLogo from "../img/white-bishop.png"
import { ListType } from "../modules/vars";
import { Consent } from "../modules/vars";
import { FiguresType } from "../modules/vars";

interface htmlTag{
    content : string;
    value : Consent | FiguresType;
}

interface list{
    type : ListType,
    items : htmlTag[]
}

interface FigurePickerProps{
    heading : string;
    list : list;
    setChoose : (newValue : FiguresType | Consent) => void;
    setWindowState : (newValue : boolean) => void;
}

export const PickerWindow : FC<FigurePickerProps> = ({heading, list, setChoose, setWindowState}) =>{
    const clickLink = (e : React.MouseEvent<HTMLUListElement>) =>{
        let clicked : any = e.target;
        while(!clicked.hasAttribute("data-value")){
            clicked = clicked.parentNode;
        }
        const clickedFigure : FiguresType = clicked.getAttribute("data-value");
        setChoose(clickedFigure);
        setWindowState(false);
    } 

    if(list.type === ListType.Figure){
        const srces : string[] = [queenLogo, knightLogo, rookLogo, bishopLogo]
        return(
            <div className="choose choose_figure">
                <h2 className="choose__heading choose_figure__heading">{heading}</h2>
                <ul className="choose__list choose_figure__list" onClick={(e) => clickLink(e)}>
                    {list.items.map((link, index) =>
                        <li 
                            key={index}
                            className={`choose__link choose_figure__link${((index === 0) ? " _active" : "")}`} 
                            data-id={index} data-value={link.value}
                        >
                            <button type="button">
                                <img src={srces[index]} alt={link.value} />
                                <span>{link.content}</span>
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        )
    }

    return(
        <div className="choose choose_consent">
            <h2 className="choose__heading choose_consent__heading">{heading}</h2>
            <ul className="choose__list choose_consent__list" onClick={(e) => clickLink(e)}>
                {list.items.map((link, index) =>
                    <li 
                        key={index}
                        className={`choose__link choose_consent__link${((index === 0) ? " _active" : "")}`} 
                        data-id={index} data-value={link.value}
                    >
                        <button type="button">{link.content}</button>
                    </li>
                )}
            </ul>
        </div>
    )
}