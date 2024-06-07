import React, { FC, useState } from "react";

interface LoseWindowProps{
    heading : string,
    restart : () => void;
}

export const LoseWindow : FC<LoseWindowProps> = ({heading, restart}) =>{
    return(
        <div className="lose-window">
            <h1 className="lose-window__heading">{heading}</h1>
            <button 
                type="button" 
                className="lose-window__restart"
                onClick={restart}
            >Restart</button>
        </div>
    )
}