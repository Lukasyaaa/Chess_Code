import React, { FC } from "react";
import { Colors, FiguresType } from "../modules/vars";
import { Figure } from "../modules/figures/Figure";

interface CellProps{
    tabIndex : number,
    id : number,
    color : Colors,
    figure : Figure | null,
    isAvailable : boolean,
    isActive : boolean,
    isDisabled : boolean,
}

export const Cell : FC<CellProps> = ({tabIndex, id, color, figure, isAvailable, isActive, isDisabled}) =>{
    let classes : string[] = ["game-board__link", ((!color) ? "black" : "white")];
    if(isActive){
        classes.push("_active");
    }
    if(isAvailable){
        classes.push("_available");
    }
    if(figure){
        classes.push("_has-figure");
        classes.push(`_figure-${(figure.getColor()) ? "white" : "black"}`);
        if(figure.getType() === FiguresType.King){
            classes.push(`_king-${(figure.getColor()) ? "white" : "black"}`);
        }
    }
    if(isDisabled){
        return(
            <li data-id={id} className={classes.join(" ")}>
                <button 
                    disabled
                    tabIndex={tabIndex}
                    type="button" 
                    className="game-board__cell"
                >
                    {figure != null && <img src={figure.getSrc()} alt={figure.getType()}/>}
                </button>
            </li>
        )
    }
    return(
        <li data-id={id} className={classes.join(" ")}>
            <button 
                tabIndex={tabIndex}
                type="button" 
                className="game-board__cell"
            >
                {figure != null && <img src={figure.getSrc()} alt={figure.getType()}/>}
            </button>
        </li>
    )
}