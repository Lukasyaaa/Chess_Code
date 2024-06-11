import React, { FC } from "react";
import { move, pseudoFigure, pseudoCell, pseudoBoard, Colors, FiguresType, coord } from "../modules/vars";
import whitePawn from "../img/white-pawn.png"
import blackPawn from "../img/black-pawn.png"
import whiteBishop from "../img/white-bishop.png"
import blackBishop from "../img/black-bishop.png"
import whiteKnight from "../img/white-knight.png"
import blackKnight from "../img/black-knight.png"
import whiteRook from "../img/white-rook.png"
import blackRook from "../img/black-rook.png"
import whiteQueen from "../img/white-queen.png"
import blackQueen from "../img/black-queen.png"
import whiteKing from "../img/white-king.png"
import blackKing from "../img/black-king.png"

interface MovesHistoryWindowProps{
    history : move[],
    close : () => void,
}

export const MovesHistoryWindow : FC<MovesHistoryWindowProps> = ({close, history}) => {
    const initPseudoBoard = () : pseudoBoard =>{
        let board : pseudoBoard = {cells: []}
        for(let y : number = 0; y < 8; y++){
            let row : pseudoCell[] = [];
            for(let x : number = 0; x < 8; x++){
                let figure : pseudoFigure | null = null;
                switch(y){
                    case 0:
                    case 7:
                        switch(x){
                            case 0:
                            case 7:
                                figure = {
                                    type: FiguresType.Rook, 
                                    color: ((y === 0) ? Colors.Black : Colors.White), 
                                    src: ((y === 0) ? blackRook : whiteRook)
                                }
                                break;
                            case 1:
                            case 6:
                                figure = {
                                    type: FiguresType.Knight, 
                                    color: ((y === 0) ? Colors.Black : Colors.White), 
                                    src: ((y === 0) ? blackKnight : whiteKnight)
                                }
                                break;
                            case 2:
                            case 5:
                                figure = {
                                    type: FiguresType.Bishop, 
                                    color: ((y === 0) ? Colors.Black : Colors.White), 
                                    src: ((y === 0) ? blackBishop : whiteBishop)
                                }
                                break;
                            case 3:
                                figure = {
                                    type: FiguresType.Queen, 
                                    color: ((y === 0) ? Colors.Black : Colors.White), 
                                    src: ((y === 0) ? blackQueen : whiteQueen)
                                }
                                break; 
                            case 4:
                                figure = {
                                    type: FiguresType.King, 
                                    color: ((y === 0) ? Colors.Black : Colors.White), 
                                    src: ((y === 0) ? blackKing : whiteKing)
                                }
                                break;    
                        }
                        break;
                    case 1:
                    case 6:
                        figure = {
                            type: FiguresType.Pawn, 
                            color: ((y === 1) ? Colors.Black : Colors.White), 
                            src: ((y === 1) ? blackPawn : whitePawn)
                        }
                        break;
                    default:
                        break;
                }
                row.push({x: x, y: y, color: Number((y + x) % 2 === 0), figure})
            }
            board.cells.push(row);
        }
        return board;
    }

    const getCopyPseudoBoard = (board : pseudoBoard) : pseudoBoard =>{
        let newBoard : pseudoBoard = {cells: []};
        for(let y = 0; y < 8; y++){
            let row : pseudoCell[] = [];
            for(let x = 0; x < 8; x++){
                row.push({x: x, y: y, color: board.cells[y][x].color, figure: board.cells[y][x].figure});
            }
            newBoard.cells.push(row)
        }
        return newBoard;
    }

    const isCastling = (figure : pseudoFigure, newCoordX : number, oldCoordX : number) : boolean =>{
        return (figure.type === FiguresType.King && (newCoordX === oldCoordX + 2 || newCoordX === oldCoordX - 2))
    }

    let boardes : pseudoBoard[] = [];
    for(let i = 0; i < history.length; i++){
        let board : pseudoBoard;
        if(!i){
            board = initPseudoBoard();
        }else{
            board = getCopyPseudoBoard(boardes[i - 1]);
        }
        if(history[i].figure.type === FiguresType.Pawn && board.cells[history[i].newCoord.y][history[i].newCoord.x].figure === null){
            const reversePawnDir = (!history[i].figure.color) ? -1 : 1
            board.cells[history[i].newCoord.y + reversePawnDir][history[i].newCoord.x].figure = null;
        } else if(isCastling(history[i].figure, history[i].newCoord.x, history[i].oldCoord.x)){
            const halfShift : number = history[i].oldCoord.x - history[i].newCoord.x / 2;
            board.cells[history[i].newCoord.y][history[i].newCoord.x + halfShift].figure = null;
            board.cells[history[i].newCoord.y][history[i].newCoord.x - halfShift].figure = {
                color: history[i].figure.color,
                type: FiguresType.Rook,
                src: (!history[i].figure.color) ? blackRook : whiteRook,
            }
        }
        board.cells[history[i].newCoord.y][history[i].newCoord.x].figure = history[i].figure;
        board.cells[history[i].oldCoord.y][history[i].oldCoord.x].figure = null;
        boardes.push(board);
    }
    let boardesIter : number = 0;

    const correctHistory : move[][] = [];
    for(let i : number = 0; i < history.length; i++){
        let row : move[] = [];
        row.push(history[i]);
        if(i + 1 < history.length){
            row.push(history[i+1]);
            i++;
        }
        correctHistory.push(row);
    }

    const isKing = (figure : pseudoFigure | null) : string =>{
        return (figure?.type === FiguresType.King) ? ` _${(!figure.color) ? "black" : "white"}-king` : "";
    }

    const hereWasCastlingRook = (cell : pseudoCell, history : move) : string =>{
        return (history.figure.type === FiguresType.King && 
            (!cell.x || cell.x === 7) && 
            ((!cell.y && history.figure.color === Colors.Black) || (cell.y === 7 && history.figure.color === Colors.White )) &&
            isCastling(history.figure, history.newCoord.x, history.oldCoord.x)) ? " _old-position" : "";
    }

    const hereCastlingRook = (cell : pseudoCell, history : move) : string =>{
        return((history.figure.type === FiguresType.King && cell.figure?.type === FiguresType.Rook && 
            history.figure.color === cell.figure.color && 
            (cell.x + 1 === history.newCoord.x || cell.x - 1 === history.newCoord.x)) ? " _new-position" : "")
    }

    const isOldPosition = (oldCoord : coord, cellCoord : coord) : string =>{
        return (cellCoord.x === oldCoord.x && cellCoord.y === oldCoord.y) ? " _old-position" : "";
    }

    const isNewPosition = (newCoord : coord, cellCoord : coord) : string =>{
        return (cellCoord.x === newCoord.x && cellCoord.y === newCoord.y) ? " _new-position" : "";
    }

    const isInDangerous = (check : Colors | null, checkmate : Colors | null) : string =>{
        if(check !== null){
            return (` _${(!check) ? "black" : "white"}-in-dangerous`);
        }
        if(checkmate !== null){
            return (` _${(!checkmate) ? "black" : "white"}-in-dangerous`);
        }
        return("")
    }

    return(
        <div className="moves modal-win">
            <h2 className="moves__heading modal-win__heading">History Moves</h2>
            <div className="moves__items">
                {correctHistory.map((move, moveNumber) => <div key={moveNumber} className="moves__item item-moves">
                    <h3 className="item-moves__number">{moveNumber + 1}</h3>
                    <div className="item-moves__parts">
                        <ul key={Number(moveNumber !== 0) * 2 * moveNumber + 1} className={`item-moves__part item-modal-win__part${isInDangerous(move[0].check, move[0].checkmate)}`}>
                            {boardes[boardesIter++].cells.map((row, rowNumber) => <React.Fragment key={rowNumber}>
                                {row.map((cell) => <li 
                                    key={cell.y * 8 + cell.x}
                                    className={`item-moves__link _${(!cell.color) ? "black" : "white"}${isOldPosition(move[0].oldCoord, {x: cell.x, y: cell.y})}${isNewPosition(move[0].newCoord, {x: cell.x, y: cell.y})}${isKing(cell.figure)}${hereWasCastlingRook(cell, move[0])}${hereCastlingRook(cell, move[0])}`}>
                                    {cell.figure && <img src={cell.figure?.src} alt={cell.figure?.type}/>}
                                    {((Boolean(isNewPosition(move[0].newCoord, {x: cell.x, y: cell.y})) || Boolean(isOldPosition(move[0].oldCoord, {x: cell.x, y: cell.y}))) && <img src={move[0].figure.src} alt={move[0].figure.type}/>)}
                                    {Boolean(hereWasCastlingRook(cell, move[0])) && 
                                        <img src={(!move[0].figure.color) ? blackRook : whiteRook} alt={FiguresType.Rook} />}
                                </li>)}
                            </React.Fragment>)}
                        </ul>
                        {move.length == 2 &&                     
                        <ul key={Number(moveNumber !== 0) * 2 * moveNumber + 2} className={`item-moves__part item-modal-win__part${isInDangerous(move[1].check, move[1].checkmate)}`}>
                            {boardes[boardesIter++].cells.map((row, rowNumber) => <React.Fragment key={rowNumber}>
                                {row.map((cell) => <li 
                                    key={cell.y * 8 + cell.x}
                                    className={`item-moves__link _${(!cell.color) ? "black" : "white"}${isOldPosition(move[1].oldCoord, {x: cell.x, y: cell.y})}${isNewPosition(move[1].newCoord, {x: cell.x, y: cell.y})}${isKing(cell.figure)}${hereWasCastlingRook(cell, move[1])}${hereCastlingRook(cell, move[1])}`}>
                                    {cell.figure && <img src={cell.figure?.src} alt={cell.figure?.type}/>}
                                    {((Boolean(isNewPosition(move[1].newCoord, {x: cell.x, y: cell.y})) || Boolean(isOldPosition(move[1].oldCoord, {x: cell.x, y: cell.y}))) && <img src={move[1].figure.src} alt={move[1].figure.type}/>)}
                                    {Boolean(hereWasCastlingRook(cell, move[1])) && 
                                        <img src={(!move[1].figure.color) ? blackRook : whiteRook} alt={FiguresType.Rook} />}
                                </li>)}
                            </React.Fragment>)}
                        </ul>}
                    </div>
                </div>)}
            </div>
            <button className="moves__close modal-win__close" type="button" onClick={close}></button>
        </div>
    )
}