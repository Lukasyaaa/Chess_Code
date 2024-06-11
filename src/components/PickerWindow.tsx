import React, { FC, ForwardRefRenderFunction, forwardRef } from "react";
import queenLogo from "../img/white-queen.png"
import knightLogo from "../img/white-knight.png"
import rookLogo from "../img/white-rook.png"
import bishopLogo from "../img/white-bishop.png"
import { ListType, Consent, FiguresType, list } from "../modules/vars";

interface PickerWindowProps{
    heading : string;
    list : list;
    setChoose : (newValue : FiguresType | Consent) => void;
    disappearPickerWin : () => void;
}

const PickerWindow : ForwardRefRenderFunction<HTMLUListElement, PickerWindowProps> = (props, ref) =>{
    const clickLink = (e : React.MouseEvent<HTMLUListElement>) =>{
        let clicked : any = e.target;
        while(!clicked.hasAttribute("data-value")){
            clicked = clicked.parentNode;
        }
        const clickedFigure : FiguresType = clicked.getAttribute("data-value");
        props.setChoose(clickedFigure);
        props.disappearPickerWin();
    } 

    if(props.list.type === ListType.Figure){
        const srces : string[] = [queenLogo, knightLogo, rookLogo, bishopLogo]
        return(
            <div className="choose choose_figure modal-win">
                <h2 className="choose__heading choose_figure__heading modal-win__heading">{props.heading}</h2>
                <ul ref={ref} className="choose__list choose_figure__list modal-win__list" onClick={(e) => clickLink(e)}>
                    {props.list.items.map((link, index) =>
                        <li 
                            key={index}
                            className={`choose__link choose_figure__link modal-win__link${((index === 0) ? " _active" : "")}`} 
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
        <div className="choose choose_consent modal-win">
            <h2 className="choose__heading choose_consent__heading modal-win__heading">{props.heading}</h2>
            <ul ref={ref} className="choose__list choose_consent__list modal-win__list" onClick={(e) => clickLink(e)}>
                {props.list.items.map((link, index) =>
                    <li 
                        key={index}
                        className={`choose__link choose_consent__link modal-win__link${((index === 0) ? " _active" : "")}`} 
                        data-id={index} data-value={link.value}
                    >
                        <button type="button">{link.content}</button>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default forwardRef<HTMLUListElement, PickerWindowProps>(PickerWindow);