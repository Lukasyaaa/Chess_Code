import Cell from "./Cell"
import { Colors } from "./vars/Colors";
import {Pawn} from "./figures/Pawn"
import {Rook} from "./figures/Rook"
import { Knight } from "./figures/Knight";
import { Bishop } from "./figures/Bishop";
import { Queen } from "./figures/Queen";
import { King } from "./figures/King";
import { FiguresType } from "./vars/FiguresType";

enum Direction{
    Diagonal = -1,
    Horizontal = 0,
    Vertical = 1,
}

class Board{
    private cells: Cell[][] = [];

    constructor(){
        this.create();
    }

    public getCells() : Cell[][]{
        return this.cells;
    }
    public getCopyBoard() : Board{
        let newBoard : Board = new Board();
        newBoard.cells = this.cells;
        return newBoard;
    }

    private create() : void{
        for(let y : number = 0; y < 8; y++){
            let row : Cell[] = [];
            for(let x : number = 0; x < 8; x++){
                row.push(new Cell(Number((y + x) % 2 == 0), x, y));
            }
            this.cells.push(row);
        }

        for(let x : number = 0; x < 8; x++){
            this.cells[1][x].setFigure(new Pawn(Colors.Black));
            this.cells[6][x].setFigure(new Pawn(Colors.White));
        }

        for(let x : number = 0; x < 8; x += 7){
            this.cells[0][x].setFigure(new Rook(Colors.Black));
            this.cells[7][x].setFigure(new Rook(Colors.White));
        }

        for(let x : number = 1; x < 7; x += 5){
            this.cells[0][x].setFigure(new Knight(Colors.Black));
            this.cells[7][x].setFigure(new Knight(Colors.White));
        }

        for(let x : number = 2; x < 6; x += 3){
            this.cells[0][x].setFigure(new Bishop(Colors.Black));
            this.cells[7][x].setFigure(new Bishop(Colors.White));
        }

        this.cells[0][3].setFigure(new Queen(Colors.Black));
        this.cells[7][3].setFigure(new Queen(Colors.White));
        this.cells[0][4].setFigure(new King(Colors.Black));
        this.cells[7][4].setFigure(new King(Colors.White));
    }

    private cycleMovement(isY : Direction, startY : number, startX : number, ourColor : Colors) : void{
        for(let isX = Number(isY !== Direction.Vertical); isX >= -1; isX -= 2 + Number(isY === Direction.Horizontal)){
            for(let dir = 1; dir >= -1; dir -= 2){
                for(let y : number = startY + isY * dir, x : number = startX + isX * dir;
                y < 8 && y >= 0 && x < 8 && x >= 0;
                y += isY * dir, x += isX * dir){
                    if(this.cells[y][x].getFigure()){
                        if(this.cells[y][x].getFigure()?.getColor() !== ourColor){
                            this.cells[y][x].makeAvailable();
                        }
                        break;
                    }
                    this.cells[y][x].makeAvailable();
                }
            }
        }
    }

    private horizontalCheck(startY : number, startX : number, ourColor : Colors) : void{
        this.cycleMovement(Direction.Horizontal, startY, startX, ourColor);
    }

    private verticalCheck(startY : number, startX : number, ourColor : Colors) : void{
        this.cycleMovement(Direction.Vertical, startY, startX, ourColor);
    }

    private diagonalCheck(startY : number, startX : number, ourColor : Colors) : void{
        this.cycleMovement(Direction.Diagonal, startY, startX, ourColor);
    }

    public answerIsAvailable(cell : Cell) : void{
        const figureCell = cell.getFigure();
        switch(figureCell?.getType()){
            case FiguresType.Rook:
                this.horizontalCheck(cell.getY(), cell.getX(), figureCell.getColor());
                this.verticalCheck(cell.getY(), cell.getX(), figureCell.getColor());
                break;
            case FiguresType.Bishop:
                this.diagonalCheck(cell.getY(), cell.getX(), figureCell.getColor());
                break;
            case FiguresType.Queen:
                this.horizontalCheck(cell.getY(), cell.getX(), figureCell.getColor());
                this.verticalCheck(cell.getY(), cell.getX(), figureCell.getColor());
                this.diagonalCheck(cell.getY(), cell.getX(), figureCell.getColor());
                break;    
            case FiguresType.King:
                const startX : number = ((cell.getX() - 1 >= 0) ? cell.getX() - 1 : cell.getX());
                const endX : number = ((cell.getX() + 1 < 8) ? cell.getX() + 2 : cell.getX() + 1);
                const startY : number = ((cell.getY() - 1 >= 0) ? cell.getY() - 1 : cell.getY());
                const endY : number = ((cell.getY() + 1 < 8) ? cell.getY() + 2 : cell.getY() + 1);
                for(let y : number = startY; y < endY; y++){
                    for(let x : number = startX; x < endX; x++){
                        if(y !== cell.getY() || x !== cell.getX()){
                            if(this.cells[y][x].getFigure()?.getColor() != figureCell.getColor()){
                                this.cells[y][x].makeAvailable();
                            }
                        }
                    }
                }
                break;
            case FiguresType.Pawn:
                const enemyColor = Number(!Boolean(figureCell.getColor()))
                const pawnDir : number = (figureCell.getColor() == Colors.White) ? -1 : 1;
                const end : number = 2 + Number((figureCell.getColor() == Colors.White && cell.getY() == 6) ||
                    (figureCell.getColor() == Colors.Black && cell.getY() == 1));
                for(let yShift = 1 * pawnDir; yShift != end * pawnDir; yShift+=pawnDir){
                    if(yShift + cell.getY() >= 0 && yShift + cell.getY() < 8 && 
                    this.cells[yShift + cell.getY()][cell.getX()].getFigure()?.getColor() != figureCell.getColor()){
                        this.cells[yShift + cell.getY()][cell.getX()].makeAvailable();
                        if(this.cells[yShift + cell.getY()][cell.getX()].getFigure()?.getColor() == enemyColor){
                            break;
                        }
                    }else{
                        break;
                    }
                }
                break;
            case FiguresType.Knight:
                for(let yShift : number = -2; yShift <= 2; yShift++){
                    if(!yShift)
                        yShift++;
                    if(yShift + cell.getY() >= 0 && yShift + cell.getY() < 8){
                        for(let xShift : number = -2 + Number(Math.abs(yShift) === 2); 
                        xShift <= 2; 
                        xShift += 2 * (2 - Number(Math.abs(yShift) === 2))){
                            if(xShift + cell.getX() >= 0 && xShift + cell.getX() < 8){
                                if(this.cells[yShift + cell.getY()][xShift + cell.getX()].getFigure()?.getColor() 
                                    != figureCell.getColor()){
                                    this.cells[yShift + cell.getY()][xShift + cell.getX()].makeAvailable();
                                }
                            }
                        }
                    }
                }
                break;      
        }
    }

    public nullingAvailable() : void{
        for(let y : number = 0; y < 8; y++){
            for(let x : number = 0; x < 8; x++){
                this.cells[y][x].makeUnAvailable();
            }
        }
    }

    public moveFigure(oldCell : Cell, newCell : Cell) : void{
        const figure = oldCell.getFigure();
        if(figure){
            this.cells[newCell.getY()][newCell.getX()].setFigure(figure);
            this.cells[oldCell.getY()][oldCell.getX()].deleteFigure();
        }
    }
}

export default Board;