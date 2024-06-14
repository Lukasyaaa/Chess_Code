import React, { FC, useState } from "react";

interface LoseWindowProps{
    heading : string,
    restart : () => void;
    setIsNeedMoveHistory: ((newValue : boolean) => void) | null;
}

export const LoseWindow : FC<LoseWindowProps> = ({heading, restart, setIsNeedMoveHistory}) =>{
    if(setIsNeedMoveHistory !== null){
        return(
            <div className="lose-window modal-win">
                <h1 className="lose-window__heading modal-win__heading">{heading}</h1>
                <div className="lose-window__buttons modal-win__buttons">
                    <button 
                        type="button" 
                        className="lose-window__button lose-window__restart modal-win__button"
                        onClick={restart}
                    >Restart</button>
                    <button
                        type="button" 
                        className="lose-window__button lose-window__show modal-win__button"
                        onClick={() => setIsNeedMoveHistory(true)}
                    >
                    View Moves
                    </button>
                </div>
            </div>
        )
    }
    return(
        <div className="lose-window modal-win">
            <h1 className="lose-window__heading modal-win__heading">{heading}</h1>
            <button 
                type="button" 
                className="lose-window__button lose-window__restart modal-win__button"
                onClick={restart}
            >Restart</button>
        </div>
    )
}