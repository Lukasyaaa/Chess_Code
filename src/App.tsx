import React, { FC, useEffect, useState } from "react";
import BoardClass from "./modules/Board";
import {Board} from "./components/Board";
import { LoseWindow } from "./components/LoseWindow";
import { FigurePicker } from "./components/FigurePicker";
import "./App.css";
import { FiguresType } from "./modules/vars/FiguresType";

export const App : FC = () =>{
    let [choosedFigure, setChoosedFigure] = useState<FiguresType>(FiguresType.Default);
    let [isAppearPicker, setIsAppearPicker] = useState<boolean>(false);
    let [board, setBoard] = useState<BoardClass>(new BoardClass);

    const restart = () => {
        const board : BoardClass = new BoardClass();
        setBoard(board);
    }

    useEffect(() =>{
        window.addEventListener("keydown", (e : KeyboardEvent) =>{
            if(e.code === "ArrowUp" || e.code === "KeyW" || e.code === "ArrowDown" || e.code === "KeyS" 
            || e.code === "Enter" || e.code === "Tab"){
                if(isAppearPicker){
                    const ourList : any = document.querySelector(".choose-figure__list");
                    for(let link of ourList.childNodes){
                        if(link.classList.contains("_active")){
                            if(e.code === "ArrowDown" || e.code === "KeyS" || e.code === "Tab"){
                                ourList.childNodes[(Number(link.getAttribute("data-id")) + 1) % 4].classList.add("_active");
                                ourList.childNodes[(Number(link.getAttribute("data-id")) + 1) % 4].childNodes[0].focus();
                            }else if(e.code === "ArrowUp" || e.code === "KeyW"){
                                ourList.childNodes[(Number(link.getAttribute("data-id")) - 1 + 4) % 4].classList.add("_active");
                                ourList.childNodes[(Number(link.getAttribute("data-id")) - 1 + 4) % 4].childNodes[0].focus();
                            }else{
                                setChoosedFigure(link.getAttribute("data-type"));
                                setIsAppearPicker(false);
                                break;
                            }
                            link.childNodes[0].blur();
                            link.classList.remove("_active");
                            break;
                        }
                    }
                }
            }
        })
    }, [isAppearPicker])

    return(
        <React.Fragment>
            <Board 
                board = {{value: board, set: setBoard}} 
                appearPicker={{value : isAppearPicker, set: setIsAppearPicker}} 
                choosedFigure={{value : choosedFigure, set: setChoosedFigure}}
            />
            {board.getCheckmate() !== null && <LoseWindow 
                result={{check: board.getCheck(), checkmate: board.getCheckmate()}} 
                restart={restart}
            />}
            {isAppearPicker && <FigurePicker setFigure = {setChoosedFigure} setWindowState = {setIsAppearPicker} />}
        </React.Fragment>
    )
}