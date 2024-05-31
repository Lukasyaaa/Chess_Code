import React, { FC } from "react";
import BoardClass from "../modules/Board";
import {Cell} from "./Cell";

interface setter<T>{
    value : T;
    set : (newValue : T) => void
}

interface BoardProps{
    board : setter<BoardClass>
}

export const Board : FC<BoardProps> = ({board}) =>{
    return(
        <main className="board">
            <ul className="board__game game-board">
                {board.value.getCells().map((row, rowIndex) => 
                    <React.Fragment key={rowIndex}>{row.map(cell => 
                        <Cell 
                            key = {cell.getY() * 8 + cell.getX()}
                            color = {cell.getColor()} 
                            figure = {cell.getFigure()}
                        />
                    )}</React.Fragment>
                )}
            </ul>
        </main>
    )
}