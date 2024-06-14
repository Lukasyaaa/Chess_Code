import React, { forwardRef, ForwardRefRenderFunction, useState } from "react";
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

const Board : ForwardRefRenderFunction<HTMLUListElement, BoardProps> = (props, ref) =>{
    let [numberActiveCell, setNumberActiveCell] = useState<number>(-1)
    if(props.choosed.value !== FiguresType.Default && props.choosed.value !== Consent.Yes && props.choosed.value !== Consent.No){
        const pawnCoord : coord = props.board.value.getHistory()[props.board.value.getHistory().length - 1].newCoord; 
        const prevPlayer : Colors = Number(!Boolean(props.board.value.getCurrentPlayer()));
        switch(props.choosed.value){
            case FiguresType.Queen:
                props.board.value.getCells()[pawnCoord.y][pawnCoord.x].setFigure(new Queen(prevPlayer));
                break;
            case FiguresType.Knight:
                props.board.value.getCells()[pawnCoord.y][pawnCoord.x].setFigure(new Knight(prevPlayer));
                break;
            case FiguresType.Rook:
                props.board.value.getCells()[pawnCoord.y][pawnCoord.x].setFigure(new Rook(prevPlayer));
                break;
            default:
                props.board.value.getCells()[pawnCoord.y][pawnCoord.x].setFigure(new Bishop(prevPlayer));
                break;
        }
        props.choosed.set(FiguresType.Default);
    }

    const changeBoard = () =>{
        const copyBoard : BoardClass = props.board.value.getCopyBoard();
        props.board.set(copyBoard);
    }

    const clickCell = (e : React.MouseEvent<HTMLUListElement>) : void =>{
        if(e.target !== e.currentTarget){
            let clicked : any = e.target;
            while(!clicked.hasAttribute("data-id")){
                clicked = clicked.parentNode;
            }
            const clickedCellId : number = Number(clicked.getAttribute("data-id"));
            let clickedCell : cellClass = props.board.value.getCells()[Math.floor(clickedCellId / 8)][clickedCellId % 8].getCopyCell();
            //Если Нету Активной Ячейки
            if(numberActiveCell === -1){
                setNumberActiveCell(clickedCellId);
                props.board.value.answerIsAvailable(clickedCell, false, true, true);
                changeBoard();
            }else{
                let activeCell : cellClass = props.board.value.getCells()[Math.floor(numberActiveCell / 8)][numberActiveCell % 8].getCopyCell();
                /*Если Нажали на Активную Ячейку
                ИНАЧЕ Если Нажали на Доступную для Хода Ячейку
                ИНАЧЕ Если Нажали на Ячейку с Фигурой такого же Цвета*/
                if(numberActiveCell === clickedCellId){
                    setNumberActiveCell(-1);
                    props.board.value.nullingAvailable();
                }else if(clickedCell.isAvailable()){
                    setNumberActiveCell(-1);
                    props.board.value.moveFigure(activeCell, clickedCell);
                    if(activeCell.getFigure()?.getType() === FiguresType.Pawn && (!clickedCell.getY() || clickedCell.getY() === 7)){
                        props.typePickerWin.set(ListType.Figure);
                    }
                }else if(clickedCell.getFigure()?.getColor() === activeCell.getFigure()?.getColor()){
                    setNumberActiveCell(clickedCellId);
                    props.board.value.nullingAvailable();
                    props.board.value.answerIsAvailable(clickedCell, false, true, true);
                }
                changeBoard();
            }
        }
    }

    const letters : string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const numbers : string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];

    let classes : string[] = ["board", `_${(!props.board.value.getCurrentPlayer()) ? "black" : "white"}-turn`];

    if(props.board.value.getCheck() !== null){
        classes.push(`_${(!props.board.value.getCheck()) ? "black" : "white"}-check`)
    }

    let tabIndeces : number[] = [];
    let tabIter : number = 1 + Number(props.board.value.getHistory().length !== 0) * 2;
    if(!props.isCellsPassive){
        for(let y : number = 0; y !== 8; y++){
            for(let x : number = 0; x !== 8; x++){
                if(props.board.value.getCells()[y][x].getFigure()?.getColor() === props.board.value.getCurrentPlayer() ||
                props.board.value.getCells()[y][x].isAvailable()){
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
            <h2 className="board__heading_turn">{`${(!props.board.value.getCurrentPlayer()) ? "Black" : "White"} turn`}</h2>
            <ul 
                ref={ref}
                onClick={(e) => clickCell(e)} 
                className="board__game game-board"
            >
                {props.board.value.getCells().map((row, rowIndex) => 
                    <React.Fragment key={rowIndex}>{row.map(cell => 
                        <Cell 
                            tabIndex = {((props.isCellsPassive) ? -1 : tabIndeces[tabIter++])}
                            key = {cell.getY() * 8 + cell.getX()}
                            id = {cell.getY() * 8 + cell.getX()}
                            color = {cell.getColor()} 
                            figure = {cell.getFigure()}
                            isAvailable = {cell.isAvailable()}
                            isActive = {(numberActiveCell === cell.getY() * 8 + cell.getX())}
                            isDisabled = {(props.isCellsPassive || tabIndeces[tabIter - 1] === -1)}
                        />
                    )}</React.Fragment>
                )}
            </ul>
            <CoordLine links={letters} dir={Direction.Horizontal} />
            <CoordLine links={numbers} dir={Direction.Vertical} />
        </main>
    )
}

export default forwardRef<HTMLUListElement, BoardProps>(Board);