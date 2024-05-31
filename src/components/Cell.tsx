import React, { FC } from "react";
import { Colors } from "../modules/vars/Colors";
import { Figure } from "../modules/figures/Figure";

interface CellProps{
    color : Colors,
    figure : Figure | null
}

export const Cell : FC<CellProps> = ({color, figure}) =>{
    let classes : string = ["game-board__link", ((!color) ? "black" : "white")].join(" ")
    return(
        <li className={classes}>
            <button className="game-board__cell">{figure != null && <img src={figure.getSrc()} alt={figure.getType()}/>}</button>
        </li>
    )
}