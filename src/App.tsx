import React, { FC, useEffect, useState, useRef } from "react";
import "./App.css";
import { Options } from "./components/Options";
import { Board } from "./components/Board";
import { EatedFigures } from "./components/EatedFigures";
import { MovesHistoryWindow } from "./components/MovesHistoryWindow";
import { LoseWindow } from "./components/LoseWindow";
import PickerWindow from "./components/PickerWindow";
import BoardClass from "./modules/Board";
import { Consent, ListType, FiguresType, list } from "./modules/vars";

export const App : FC = () => {
    let [board, setBoard] = useState<BoardClass>(new BoardClass());
    let [whiteTimer, setWhiteTimer] = useState<number>(300);
    let [blackTimer, setBlackTimer] = useState<number>(300);

    let [isGaveUp, setIsGaveUp] = useState<boolean>(false);
    let [isNeedMovesHistory, setIsNeedMoveHistory] = useState<boolean>(false);
    let [typePickerWin, setTypePickerWin] = useState<null | ListType>(null);
    let [picked, setPicked] = useState<FiguresType | Consent>(FiguresType.Default);

    let chooseList = useRef<HTMLUListElement>(null);
    useEffect(() =>{
        window.addEventListener("keydown", (e : KeyboardEvent) =>{
            if(chooseList.current && typePickerWin !== null){
                const ourList : any = chooseList.current;
                let pressedNumber : number = 0;
                //Проверка на то являеться ли нажатой Клавишей - Цифра
                for(let number : number = 1; number != ourList.childNodes.length + 1; number++){
                    /*Операция: [e.code.length - 1] - Даст мне Последний символ нажатой Клавиши
                    P.S. Код клавиши с Цифрой:(KeyЦифра) и при помощи операции выше - я получу Цифру(Если была нажата Клавиша с Цифрой)*/
                    if(Number(e.code[e.code.length - 1]) === number){
                        pressedNumber = number;
                        break;
                    }
                }
                if(pressedNumber || e.code === "ArrowUp" || e.code === "KeyW" || e.code === "ArrowDown" || e.code === "KeyS" 
                || e.code === "Enter" || e.code === "Tab"){
                    e.preventDefault();
                    for(let link of ourList.childNodes){
                        if(link.classList.contains("_active")){
                            if(pressedNumber){
                                ourList.childNodes[pressedNumber - 1].classList.add("_active");
                                ourList.childNodes[pressedNumber - 1].childNodes[0].focus();
                            }
                            else if(e.code === "ArrowDown" || e.code === "KeyS" || e.code === "Tab"){
                                let numberNextLink : number = Number(link.getAttribute("data-id")) + 1;
                                ourList.childNodes[numberNextLink % ourList.childNodes.length].classList.add("_active");
                                ourList.childNodes[numberNextLink % ourList.childNodes.length].childNodes[0].focus();
                            }else if(e.code === "ArrowUp" || e.code === "KeyW"){
                                let numberPrevLink : number = Number(link.getAttribute("data-id")) - 1;
                                ourList.childNodes[(numberPrevLink + ourList.childNodes.length) % ourList.childNodes.length].classList.add("_active");
                                ourList.childNodes[(numberPrevLink + ourList.childNodes.length) % ourList.childNodes.length].childNodes[0].focus();
                            }else{
                                setPicked(link.getAttribute("data-value"));
                                setTypePickerWin(null);
                            }
                            link.childNodes[0].blur();
                            link.classList.remove("_active");
                            break;
                        }
                    }
                }
            }
        })
    }, [typePickerWin])

    const timer = useRef<null | ReturnType<typeof setInterval>>(null);
    const decrementWhite = () =>{
        setWhiteTimer(prev => prev - 1);
    }
    const decrementBlack = () =>{
        setBlackTimer(prev => prev - 1);
    }
    const decrementTimer = () =>{
        if(timer.current){
            clearInterval(timer.current);
        }
        const callback = ((!board.getCurrentPlayer()) ? decrementBlack : decrementWhite);
        timer.current = setInterval(callback, 1000);
    }

    const restart = () => {
        setIsGaveUp(false);

        const board : BoardClass = new BoardClass();
        setBoard(board);
        setWhiteTimer(300);
        setBlackTimer(300);
        decrementTimer();
    }

    if(picked === Consent.Yes){
        restart();
        setPicked(FiguresType.Default);
    }

    useEffect(() =>{
        decrementTimer();
    }, [board.getCurrentPlayer()]);

    if(!whiteTimer || !blackTimer || board.getCheckmate() !== null || typePickerWin !== null || isGaveUp){
        if(timer.current){
            clearInterval(timer.current);
        }
    }

    const disappearPickerWin = () =>{
        setTypePickerWin(null);
        const callback = ((!board.getCurrentPlayer()) ? decrementBlack : decrementWhite);
        timer.current = setInterval(callback, 1000);
    }

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
                setIsGaveUp={setIsGaveUp} 
                setTypePickerWin={setTypePickerWin} 
                buttonsDisabled={board.getHistory().length === 0 || typePickerWin !== null || isGaveUp || isNeedMovesHistory}
                whiteTimer={whiteTimer}
                blackTimer={blackTimer} 
            />
            <Board 
                board = {{value: board, set: setBoard}} 
                typePickerWin={{value : typePickerWin, set: setTypePickerWin}} 
                choosed={{value : picked, set: setPicked}}
                isCellsPassive={typePickerWin !== null || isGaveUp || isNeedMovesHistory}
            />
            <EatedFigures eatedBlack = {board.getBlackEatedFigures()} eatedWhite = {board.getWhiteEatedFigures()} />
            {board.getCheckmate() !== null && !isNeedMovesHistory && <LoseWindow 
                heading={(!board.getCheckmate()) ? "Black Checkmate" : "White Checkmate"}
                restart={restart}
                setIsNeedMoveHistory={setIsNeedMoveHistory}
            />}
            {isGaveUp && !isNeedMovesHistory && <LoseWindow 
                heading={(!board.getCurrentPlayer()) ? "Black gave up" : "White gave up"}
                restart={restart}
                setIsNeedMoveHistory={setIsNeedMoveHistory}
            />}
            {!whiteTimer && !isNeedMovesHistory && <LoseWindow 
                heading="White out of Time"
                restart={restart}  
                setIsNeedMoveHistory={(board.getHistory().length) ? setIsNeedMoveHistory : null}
            />}
            {!blackTimer && !isNeedMovesHistory && <LoseWindow 
                heading="Black out of Time"
                restart={restart}   
                setIsNeedMoveHistory={(board.getHistory().length) ? setIsNeedMoveHistory : null}         
            />}
            {typePickerWin === ListType.Figure && <PickerWindow 
                ref={chooseList}
                heading = "Choose new Shape"
                list = {figuresList}
                setChoose = {setPicked} 
                disappearPickerWin = {disappearPickerWin} 
            />}
            {typePickerWin === ListType.Consent && <PickerWindow 
                ref={chooseList}
                heading = "Are you agreeable to a Draw"
                list = {drawList}
                setChoose = {setPicked} 
                disappearPickerWin = {disappearPickerWin} 
            />}
            {isNeedMovesHistory && <MovesHistoryWindow 
                history={board.getHistory()}
                setIsNeedMoveHistory={setIsNeedMoveHistory}
            />}
        </React.Fragment>
    )
}