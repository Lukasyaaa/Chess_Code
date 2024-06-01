import React, { FC, useState } from "react";
import BoardClass from "../modules/Board";
import { Direction } from "../modules/vars/Directions"
import { CoordLine } from "./CoordLine";
import { Colors } from "../modules/vars/Colors";
import { Cell } from "./Cell";
import cellClass  from "../modules/Cell";

interface setter<T>{
    value : T;
    set : (newValue : T) => void
}

interface BoardProps{
    board : setter<BoardClass>
}

export const Board : FC<BoardProps> = ({board}) =>{
    let [currenPlayer, setCurrentPlayer] = useState<Colors>(Colors.White)
    let [numberActiveCell, setNumberActiveCell] = useState<number>(-1)

    const changeBoard = () =>{
        const copyBoard = board.value.getCopyBoard();
        board.set(copyBoard);
    }

    const clickCell = (e : React.MouseEvent<HTMLUListElement>) : void =>{
        if(e.target !== e.currentTarget){
            let clicked : any = e.target;
            while(!clicked.hasAttribute("data-id")){
                clicked = clicked.parentNode;
            }
            let clickedCell : cellClass = board.value.getCells()
                [Math.floor(clicked.getAttribute("data-id") / 8)][clicked.getAttribute("data-id") % 8].getCopyCell();

            //Если Нету Активной Ячейки
            if(numberActiveCell === -1){
                if(clickedCell.getFigure()?.getColor() === currenPlayer){
                    setNumberActiveCell(Number(clicked.getAttribute("data-id")));
                    board.value.answerIsAvailable(clickedCell);
                    changeBoard();
                }
            }else{
                let activeCell : cellClass = board.value.getCells()
                    [Math.floor(numberActiveCell / 8)][numberActiveCell % 8].getCopyCell();
                /*Если Нажали на Активную Ячейку
                ИНАЧЕ Если Нажали на Доступную для Хода Ячейку
                ИНАЧЕ Если Нажали на Ячейку с Фигурой такого же Цвета*/
                if(numberActiveCell == clicked.getAttribute("data-id")){
                    setNumberActiveCell(-1);
                    board.value.nullingAvailable();
                }else if(clickedCell.isAvailable()){
                    board.value.moveFigure(activeCell, clickedCell);
                    board.value.nullingAvailable();
                    setNumberActiveCell(-1);
                    setCurrentPlayer((currenPlayer) ? Colors.Black : Colors.White);
                }else if(clickedCell.getFigure()?.getColor() === activeCell.getFigure()?.getColor()){
                    setNumberActiveCell(Number(clicked.getAttribute("data-id")));
                    board.value.nullingAvailable();
                    board.value.answerIsAvailable(clickedCell);
                }
                changeBoard();
            }
        }
    }

    const letters : string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const numbers : string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];

    return(
        <main className="board">
            <ul 
                onClick={(e) => clickCell(e)} 
                className={["board__game", "game-board", `_${(currenPlayer) ? "white" : "black"}-turn`].join(" ")}
            >
                {board.value.getCells().map((row, rowIndex) => 
                    <React.Fragment key={rowIndex}>{row.map(cell => 
                        <Cell 
                            key = {cell.getY() * 8 + cell.getX()}
                            id = {cell.getY() * 8 + cell.getX()}
                            color = {cell.getColor()} 
                            figure = {cell.getFigure()}
                            isAvailable = {cell.isAvailable()}
                            isActive = {(numberActiveCell === cell.getY() * 8 + cell.getX())}
                        />
                    )}</React.Fragment>
                )}
            </ul>
            <CoordLine links={letters} dir={Direction.Horizontal} />
            <CoordLine links={numbers} dir={Direction.Vertical} />
        </main>
    )
}