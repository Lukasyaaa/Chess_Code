import Cell from "./Cell"
import { Colors } from "./vars/Colors";
import {Pawn} from "./figures/Pawn"
import {Rook} from "./figures/Rook"
import { Knight } from "./figures/Knight";
import { Bishop } from "./figures/Bishop";
import { Queen } from "./figures/Queen";
import { King } from "./figures/King";

class Board{
    private cells: Cell[][] = [];

    constructor(){
        this.create();
    }

    public getCells() : Cell[][]{
        return this.cells;
    }

    private create() : void{
        for(let y : number = 0; y < 8; y++){
            let row : Cell[] = [];
            for(let x : number = 0; x < 8; x++){
                row.push(new Cell(this, Number((y + x) % 2 == 0), x, y));
            }
            this.cells.push(row);
        }

        for(let x : number = 0; x < 8; x++){
            new Pawn(Colors.Black, this.cells[1][x]);
            new Pawn(Colors.White, this.cells[6][x]);
        }

        for(let x : number = 0; x < 8; x += 7){
            new Rook(Colors.Black, this.cells[0][x]);
            new Rook(Colors.White, this.cells[7][x]);
        }

        for(let x : number = 1; x < 7; x += 5){
            new Knight(Colors.Black, this.cells[0][x]);
            new Knight(Colors.White, this.cells[7][x]);
        }

        for(let x : number = 2; x < 6; x += 3){
            new Bishop(Colors.Black, this.cells[0][x]);
            new Bishop(Colors.White, this.cells[7][x]);
        }

        new Queen(Colors.Black, this.cells[0][3]);
        new Queen(Colors.White, this.cells[7][3]);
        new King(Colors.Black, this.cells[0][4]);
        new King(Colors.White, this.cells[7][4]);
    }
}

export default Board;