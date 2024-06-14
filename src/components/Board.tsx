import React, { FC, useState } from "react";
import { CoordLine } from "./CoordLine";
import { Cell } from "./Cell";
import BoardClass from "../modules/Board";
import cellClass  from "../modules/Cell";
import { Colors, Consent, ListType, Direction, FiguresType, coord } from "../modules/vars";
import { Queen } from "../modules/figures/Queen";
import { Knight } from "../modules/figures/Knight";
import { Rook } from "../modules/figures/Rook";
import { Bishop } from "../modules/figures/Bishop";

interface setter<T>{
    value : T;
    set : (newValue : T) => void;
}

interface typePickerWinSetter{
    value : ListType | null;
    set : (newValue : ListType) => void;
}

interface BoardProps{
    board : setter<BoardClass>,
    typePickerWin : typePickerWinSetter,
    choosed : setter<FiguresType | Consent>,
    isCellsPassive : boolean;
}

export const Board : FC<BoardProps> = ({board, typePickerWin, choosed, isCellsPassive}) =>{
    let [numberActiveCell, setNumberActiveCell] = useState<number>(-1)

    if(choosed.value !== FiguresType.Default && choosed.value !== Consent.Yes && choosed.value !== Consent.No){
        const pawnCoord : coord = board.value.getHistory()[board.value.getHistory().length - 1].newCoord; 
        const prevPlayer : Colors = Number(!Boolean(board.value.getCurrentPlayer()));
        switch(choosed.value){
            case FiguresType.Queen:
                board.value.getCells()[pawnCoord.y][pawnCoord.x].setFigure(new Queen(prevPlayer));
                break;
            case FiguresType.Knight:
                board.value.getCells()[pawnCoord.y][pawnCoord.x].setFigure(new Knight(prevPlayer));
                break;
            case FiguresType.Rook:
                board.value.getCells()[pawnCoord.y][pawnCoord.x].setFigure(new Rook(prevPlayer));
                break;
            default:
                board.value.getCells()[pawnCoord.y][pawnCoord.x].setFigure(new Bishop(prevPlayer));
                break;
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
            const clickedCellId : number = Number(clicked.getAttribute("data-id"));
            let clickedCell : cellClass = board.value.getCells()[Math.floor(clickedCellId / 8)][clickedCellId % 8].getCopyCell();
            //Если Нету Активной Ячейки
            if(numberActiveCell === -1){
                setNumberActiveCell(clickedCellId);
                board.value.answerIsAvailable(clickedCell, false, true, true);
                changeBoard();
            }else{
                let activeCell : cellClass = board.value.getCells()[Math.floor(numberActiveCell / 8)][numberActiveCell % 8].getCopyCell();
                /*Если Нажали на Активную Ячейку
                ИНАЧЕ Если Нажали на Доступную для Хода Ячейку
                ИНАЧЕ Если Нажали на Ячейку с Фигурой такого же Цвета*/
                if(numberActiveCell === clickedCellId){
                    setNumberActiveCell(-1);
                    board.value.nullingAvailable();
                }else if(clickedCell.isAvailable()){
                    setNumberActiveCell(-1);
                    board.value.moveFigure(activeCell, clickedCell);
                    if(activeCell.getFigure()?.getType() === FiguresType.Pawn && (!clickedCell.getY() || clickedCell.getY() === 7)){
                        typePickerWin.set(ListType.Figure);
                    }
                }else if(clickedCell.getFigure()?.getColor() === activeCell.getFigure()?.getColor()){
                    setNumberActiveCell(clickedCellId);
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

    let tabIndeces : number[] = [];
    let tabIter : number = 1 + Number(board.value.getHistory().length !== 0) * 2;
    if(!isCellsPassive){
        for(let y : number = 0; y !== 8; y++){
            for(let x : number = 0; x !== 8; x++){
                if(board.value.getCells()[y][x].getFigure()?.getColor() === board.value.getCurrentPlayer() ||
                board.value.getCells()[y][x].isAvailable()){
                    tabIndeces.push(tabIter++);
                }else{
                    tabIndeces.push(-1);
                }
            }
        }
        tabIter = 0;
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
                            tabIndex = {((isCellsPassive) ? -1 : tabIndeces[tabIter++])}
                            key = {cell.getY() * 8 + cell.getX()}
                            id = {cell.getY() * 8 + cell.getX()}
                            color = {cell.getColor()} 
                            figure = {cell.getFigure()}
                            isAvailable = {cell.isAvailable()}
                            isActive = {(numberActiveCell === cell.getY() * 8 + cell.getX())}
                            isDisabled = {(isCellsPassive || tabIndeces[tabIter - 1] === -1)}
                        />
                    )}</React.Fragment>
                )}
            </ul>
            <CoordLine links={letters} dir={Direction.Horizontal} />
            <CoordLine links={numbers} dir={Direction.Vertical} />
        </main>
    )
}