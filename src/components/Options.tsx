import React, { FC } from "react";
import { ListType } from "../modules/vars";

interface OptionsProps{
    setIsGaveUp : (newValue : boolean) => void;
    setTypePickerWin : (type : ListType) => void;
    buttonsDisabled : boolean;
    whiteTimer : number;
    blackTimer : number;
}

export const Options : FC<OptionsProps> = ({setIsGaveUp, setTypePickerWin, buttonsDisabled, whiteTimer, blackTimer}) =>{
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
                    onClick={() => setTypePickerWin(ListType.Consent)}
                >Offer a draw</button>
                <button 
                    tabIndex={2}
                    className="options__button options__give-up" 
                    type="button" 
                    onClick={() => setIsGaveUp(true)}
                >Give up</button>
            </div>
        </div>
    )
}