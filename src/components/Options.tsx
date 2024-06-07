import React, { FC } from "react";
import { Colors } from "../modules/vars";

interface OptionsProps{
    giveUp : (newValue : boolean) => void;
    offerDraw : (newValue : boolean) => void;
    buttonsDisabled : boolean;
    whiteTimer : number;
    blackTimer : number;
}

export const Options : FC<OptionsProps> = ({giveUp, offerDraw, buttonsDisabled, whiteTimer, blackTimer}) =>{

    if(buttonsDisabled){
        return(
            <div className="options _not-active">
                <div className="options__timers">
                    <span className="options__timer options__timer_white">White: {whiteTimer}</span>
                    <span className="options__timer options__timer_black">Black: {blackTimer}</span>
                </div>
                <div className="options__buttons">
                    <button 
                        className="options__button options__draw" 
                        type="button" 
                        onClick={() => offerDraw(true)}
                        disabled
                    >Offer a draw</button>
                    <button 
                        className="options__button options__give-up" 
                        type="button" 
                        onClick={() => giveUp(true)}
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
                <button className="options__button options__draw" type="button" onClick={() => offerDraw(true)}>Offer a draw</button>
                <button className="options__button options__give-up" type="button" onClick={() => giveUp(true)}>Give up</button>
            </div>
        </div>
    )
}