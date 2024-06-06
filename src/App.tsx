import React, { FC, useState } from "react";
import BoardClass from "./modules/Board";
import {Board} from "./components/Board";
import { LoseWindow } from "./components/LoseWindow";
import "./App.css";

export const App : FC = () =>{
    let [board, setBoard] = useState<BoardClass>(new BoardClass);

    const restart = () => {
        const board : BoardClass = new BoardClass();
        setBoard(board);
    }

    return(
        <div>
            <Board board = {{value: board, set: setBoard}} />
            {(board.getCheckmate() !== null || board.getCheck() !== null) && <LoseWindow 
                result={{check: board.getCheck(), checkmate: board.getCheckmate()}} 
                restart={restart}
            />}
        </div>
    )
}