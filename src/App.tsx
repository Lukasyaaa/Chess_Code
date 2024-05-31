import React, { FC, useState } from "react";
import BoardClass from "./modules/Board";
import {Board} from "./components/Board";
import {CoordLine} from "./components/CoordLine"
import {Direction} from "./modules/vars/Directions"
import "./App.css";

export const App : FC = () =>{
    let [board, setBoard] = useState<BoardClass>(new BoardClass);

    const letters : string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const numbers : string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];

    return(
        <div className="board">
            <Board board = {{value: board, set: setBoard}} />
            <CoordLine links={letters} dir={Direction.Horizontal} />
            <CoordLine links={numbers} dir={Direction.Vertical} />
        </div>
    )
}