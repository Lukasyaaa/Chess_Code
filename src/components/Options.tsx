import React, { FC } from "react";
import { ListType } from "../modules/vars";

interface OptionsProps{
    gaveUp : () => void;
    appearPickerWin : (type : ListType) => void;
    buttonsDisabled : boolean;
    whiteTimer : number;
    blackTimer : number;
}

export const Options : FC<OptionsProps> = ({gaveUp, appearPickerWin, buttonsDisabled, whiteTimer, blackTimer}) =>{

    if(buttonsDisabled){
        return(
            <div className="options _not-active">
                <div className="options__timers">
                    <span className="options__timer options__timer_white">White: {whiteTimer}</span>
                    <span className="options__timer options__timer_black">Black: {blackTimer}</span>
                </div>
                <div className="options__buttons">
                    <button 
                        tabIndex={-1}
                        className="options__button options__draw" 
                        type="button" 
                        disabled
                    >Offer a draw</button>
                    <button 
                        tabIndex={-1}
                        className="options__button options__give-up" 
                        type="button" 
                        disabled
                    >Give up</button>
                </div>
            </div>
        )
    }
    return(
        <div className="options">
            <div className="options__timers">
                <span className="options__timer options__timer_white">White: {whiteTimer}</span>
                <span className="options__timer options__timer_black">Black: {blackTimer}</span>
            </div>
            <div className="options__buttons">
                <button 
                    tabIndex={1}
                    className="options__button options__draw" 
                    type="button" 
                    onClick={() => appearPickerWin(ListType.Consent)}
                >Offer a draw</button>
                <button 
                    tabIndex={2}
                    className="options__button options__give-up" 
                    type="button" 
                    onClick={gaveUp}
                >Give up</button>
            </div>
        </div>
    )
}