import React, { FC, useState } from "react";
import BoardClass from "./modules/Board";
import {Board} from "./components/Board";
import "./App.css";

export const App : FC = () =>{
    let [board, setBoard] = useState<BoardClass>(new BoardClass)
    return(
        <div className="board">
            <Board board = {{value: board, set: setBoard}} />
        </div>
    )
}