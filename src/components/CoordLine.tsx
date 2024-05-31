import React, {FC} from "react";
import { Direction } from "../modules/vars/Directions";

interface CoordLineProps{
    links : string[];
    dir : Direction;
}

export const CoordLine : FC<CoordLineProps> = ({links, dir}) =>{
    return(
        <ul className={["board__coordline", "coordline-board" , dir].join(" ")}>
            {links.map((link, index) => <li key={index} className="coordline-board__item">{link}</li>)}
        </ul>
    )
}