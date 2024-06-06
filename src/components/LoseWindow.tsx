import React, { FC, useState } from "react";
import { Colors } from "../modules/vars/Colors";

interface result{
    check: Colors | null;
    checkmate: Colors | null;
}

interface LoseWindowProps{
    result : result,
    restart : () => void;
}

export const LoseWindow : FC<LoseWindowProps> = ({result, restart}) =>{
    return(
        <div className="lose-window">
            <h1 className="lose-window__heading">{(result.checkmate !== null) ? 
                ((!result.checkmate) ? "Black Checkmate" : "White Checkmate") : 
                ((!result.checkmate) ? "Black Check" : "White Check")}
            </h1>
            <button 
                type="button" 
                className="lose-window__restart"
                onClick={restart}
            >Restart</button>
        </div>
    )
}