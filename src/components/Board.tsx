import React, { FC, useState } from "react";
import BoardClass from "../modules/Board";
import { Colors, Consent } from "../modules/vars";
import { FiguresType } from "../modules/vars";
import { Direction } from "../modules/vars"
import { CoordLine } from "./CoordLine";
import { Cell } from "./Cell";
import cellClass  from "../modules/Cell";
import { Queen } from "../modules/figures/Queen";
import { Knight } from "../modules/figures/Knight";
import { Rook } from "../modules/figures/Rook";
import { Bishop } from "../modules/figures/Bishop";

interface setter<T>{
    value : T;
    set : (newValue : T) => void
}

interface BoardProps{
    board : setter<BoardClass>
    appearPicker : setter<boolean>
    choosed : setter<FiguresType | Consent>
}

export const Board : FC<BoardProps> = ({board, appearPicker, choosed}) =>{
    let [numberActiveCell, setNumberActiveCell] = useState<number>(-1)

    if(choosed.value !== FiguresType.Default && choosed.value !== Consent.Yes && choosed.value !== Consent.No){
        const prevPlayer : Colors = Number(!Boolean(board.value.getCurrentPlayer()));
        let leaveCycle : boolean = false;
        for(let y : number = 0; !leaveCycle && y < 8; y+=7){
            for(let x : number = 0; x < 8; x++){
                if(board.value.getCells()[y][x].getFigure()?.getColor() === prevPlayer &&
                board.value.getCells()[y][x].getFigure()?.getType() === FiguresType.Pawn){
                    console.log(choosed.value);
                    switch(choosed.value){
                        case FiguresType.Queen:
                            board.value.getCells()[y][x].setFigure(new Queen(prevPlayer));
                            break;
                        case FiguresType.Knight:
                            board.value.getCells()[y][x].setFigure(new Knight(prevPlayer));
                            break;
                        case FiguresType.Rook:
                            board.value.getCells()[y][x].setFigure(new Rook(prevPlayer));
                            break;
                        default:
                            board.value.getCells()[y][x].setFigure(new Bishop(prevPlayer));
                            break;
                    }
                    leaveCycle = true;
                    break;
                }
            }
        }
        choosed.set(FiguresType.Default);
    }

    const changeBoard = () =>{
        const copyBoard : BoardClass = board.value.getCopyBoard();
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
                if(clickedCell.getFigure()?.getColor() === board.value.getCurrentPlayer()){
                    setNumberActiveCell(Number(clicked.getAttribute("data-id")));
                    board.value.answerIsAvailable(clickedCell, false, true, true);
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
                    setNumberActiveCell(-1);
                    board.value.moveFigure(activeCell, clickedCell);
                    board.value.nullingAvailable();
                    if(activeCell.getFigure()?.getType() === FiguresType.Pawn && (!clickedCell.getY() || clickedCell.getY() === 7)){
                        appearPicker.set(true);
                    }
                }else if(clickedCell.getFigure()?.getColor() === activeCell.getFigure()?.getColor()){
                    setNumberActiveCell(Number(clicked.getAttribute("data-id")));
                    board.value.nullingAvailable();
                    board.value.answerIsAvailable(clickedCell, false, true, true);
                }
                changeBoard();
            }
        }
    }

    const letters : string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const numbers : string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];

    let classes : string[] = ["board", `_${(!board.value.getCurrentPlayer()) ? "black" : "white"}-turn`];

    if(board.value.getCheck() !== null){
        classes.push(`_${(!board.value.getCheck()) ? "black" : "white"}-check`)
    }

    return(
        <main className={classes.join(" ")}>
            <h2 className="board__heading_turn">{`${(!board.value.getCurrentPlayer()) ? "Black" : "White"} turn`}</h2>
            <ul 
                onClick={(e) => clickCell(e)} 
                className="board__game game-board"
            >
                {board.value.getCells().map((row, rowIndex) => 
                    <React.Fragment key={rowIndex}>{row.map(cell => 
                        <Cell 
                            tabIndex = {((appearPicker) ? -1 : cell.getY() * 8 + cell.getX())}
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