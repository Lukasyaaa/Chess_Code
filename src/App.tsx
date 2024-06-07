import React, { FC, useEffect, useState, useRef } from "react";
import BoardClass from "./modules/Board";
import { Consent, ListType } from "./modules/vars";
import { FiguresType } from "./modules/vars";
import { Board } from "./components/Board";
import { LoseWindow } from "./components/LoseWindow";
import { PickerWindow } from "./components/PickerWindow";
import "./App.css";
import { EatedFigures } from "./components/EatedFigures";
import { Options } from "./components/Options";

interface htmlTag{
    content : string;
    value : Consent | FiguresType;
}

interface list{
    type : ListType,
    items : htmlTag[]
}

export const App : FC = () =>{
    let [whiteTimer, setWhiteTimer] = useState<number>(300);
    let [blackTimer, setBlackTimer] = useState<number>(300);

    let [choosed, setChoosed] = useState<FiguresType | Consent>(FiguresType.Default);

    let [isNeedNewShape, setIsNeedNewShape] = useState<boolean>(false);
    let [isDraw, setIsDraw] = useState<boolean>(false);

    let [isGameOver, setIsGameOver] = useState<boolean>(false);

    let [board, setBoard] = useState<BoardClass>(new BoardClass());

    const restart = () => {
        const board : BoardClass = new BoardClass();
        setBoard(board);
        setIsGameOver(false);
        setWhiteTimer(300);
        setBlackTimer(300);
    }

    if(choosed === Consent.Yes){
        restart();
        setChoosed(FiguresType.Default);
    }

    useEffect(() =>{
        window.addEventListener("keydown", (e : KeyboardEvent) =>{
            if(e.code === "ArrowUp" || e.code === "KeyW" || e.code === "ArrowDown" || e.code === "KeyS" 
            || e.code === "Enter" || e.code === "Tab"){
                if(isNeedNewShape || isDraw){
                    const ourList : any = document.querySelector(".choose__list");
                    if(ourList){
                        for(let link of ourList.childNodes){
                            if(link.classList.contains("_active")){
                                if(e.code === "ArrowDown" || e.code === "KeyS" || e.code === "Tab"){
                                    ourList.childNodes[(Number(link.getAttribute("data-id")) + 1) % ourList.childNodes.length].classList.add("_active");
                                    ourList.childNodes[(Number(link.getAttribute("data-id")) + 1) % ourList.childNodes.length].childNodes[0].focus();
                                }else if(e.code === "ArrowUp" || e.code === "KeyW"){
                                    ourList.childNodes[(Number(link.getAttribute("data-id")) - 1 + ourList.childNodes.length) % ourList.childNodes.length].classList.add("_active");
                                    ourList.childNodes[(Number(link.getAttribute("data-id")) - 1 + ourList.childNodes.length) % ourList.childNodes.length].childNodes[0].focus();
                                }else{
                                    debugger;
                                    setChoosed(link.getAttribute("data-value"));
                                    if(isDraw){
                                        setIsDraw(false);
                                    }else{
                                        setIsNeedNewShape(false);
                                    }
                                }
                                link.childNodes[0].blur();
                                link.classList.remove("_active");
                                break;
                            }
                        }
                    }
                }
            }
        })
    }, [isNeedNewShape, isDraw])

    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

    const decrementWhite = () =>{
        setWhiteTimer(prev => Math.max(prev - 1, 0));
    }

    const decrementBlack = () =>{
        setBlackTimer(prev => Math.max(prev - 1, 0));
    }
    
    useEffect(() =>{
        if(timer.current){
            clearInterval(timer.current);
        }
        const callback = ((!board.getCurrentPlayer()) ? decrementBlack : decrementWhite);
        timer.current = setInterval(callback, 1000);
    }, [board.getCurrentPlayer()]);

    const figuresList : list = {
        type: ListType.Figure,
        items: [
            {content: "Queen", value: FiguresType.Queen}, 
            {content: "Knight", value: FiguresType.Knight}, 
            {content: "Rook", value: FiguresType.Rook}, 
            {content: "Bishop", value: FiguresType.Bishop}
        ]
    };
    const drawList : list = {
        type: ListType.Consent,
        items: [
            {content: "Yes", value: Consent.Yes}, 
            {content: "No", value: Consent.No}, 
        ]
    }

    return(
        <React.Fragment>
            <Options 
                giveUp={setIsGameOver} 
                offerDraw={setIsDraw} 
                buttonsDisabled={board.getHistory().length == 0}
                whiteTimer={whiteTimer}
                blackTimer={blackTimer} 
            />
            <Board 
                board = {{value: board, set: setBoard}} 
                appearPicker={{value : isNeedNewShape, set: setIsNeedNewShape}} 
                choosed={{value : choosed, set: setChoosed}}
            />
            <EatedFigures eatedBlack = {board.getBlackEatedFigures()} eatedWhite = {board.getWhiteEatedFigures()} />
            {board.getCheckmate() !== null && <LoseWindow 
                heading={(!board.getCheckmate()) ? "Black Checkmate" : "White Checkmate"}
                restart={restart}
            />}
            {isGameOver && <LoseWindow 
                heading={`${(!board.getCurrentPlayer()) ? "Black" : "White"} gave up`} 
                restart={restart}
            />}
            {!whiteTimer && <LoseWindow 
                heading="White out of Time"
                restart={restart}            
            />}
            {!blackTimer && <LoseWindow 
                heading="Black out of Time"
                restart={restart}            
            />}
            {isNeedNewShape && <PickerWindow 
                heading = "Choose new Shape"
                list = {figuresList}
                setChoose = {setChoosed} 
                setWindowState = {setIsNeedNewShape} 
            />}
            {isDraw && <PickerWindow 
                heading = "Are you agreeable to a Draw"
                list = {drawList}
                setChoose = {setChoosed} 
                setWindowState = {setIsDraw} 
            />}
        </React.Fragment>
    )
}