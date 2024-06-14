import Cell from "./Cell"
import { move, coord, Colors, FiguresType } from "./vars";
import { Figure } from "./figures/Figure";
import { Pawn } from "./figures/Pawn"
import { Rook } from "./figures/Rook"
import { Knight } from "./figures/Knight";
import { Bishop } from "./figures/Bishop";
import { Queen } from "./figures/Queen";
import { King } from "./figures/King";

enum Direction{
    Diagonal = -1,
    Horizontal = 0,
    Vertical = 1,
}

class Board{
    private cells             : Cell[][] = [];
    private history           : move[] = [];
    private currentPlayer     : Colors = Colors.White
    private check             : Colors | null = null;
    private checkmate         : Colors | null = null;
    private blackEatedFigures : Figure[] = [];
    private whiteEatedFigures : Figure[] = [];

    constructor(){
        this.create();
    }

    private create() : void{
        for(let y : number = 0; y !== 8; y++){
            let row : Cell[] = [];
            for(let x : number = 0; x !== 8; x++){
                row.push(new Cell(Number((y + x) % 2 === 0), x, y));
            }
            this.cells.push(row);
        }

        for(let x : number = 0; x !== 8; x++){
            this.cells[1][x].setFigure(new Pawn(Colors.Black));
            this.cells[6][x].setFigure(new Pawn(Colors.White));
        }

        for(let x : number = 0; x !== 14; x += 7){
            this.cells[0][x].setFigure(new Rook(Colors.Black));
            this.cells[7][x].setFigure(new Rook(Colors.White));
        }

        for(let x : number = 1; x !== 11; x += 5){
            this.cells[0][x].setFigure(new Knight(Colors.Black));
            this.cells[7][x].setFigure(new Knight(Colors.White));
        }

        for(let x : number = 2; x !== 8; x += 3){
            this.cells[0][x].setFigure(new Bishop(Colors.Black));
            this.cells[7][x].setFigure(new Bishop(Colors.White));
        }

        this.cells[0][3].setFigure(new Queen(Colors.Black));
        this.cells[7][3].setFigure(new Queen(Colors.White));
        this.cells[0][4].setFigure(new King(Colors.Black));
        this.cells[7][4].setFigure(new King(Colors.White));
    }

    public getCopyBoard() : Board{
        let newBoard : Board = new Board();
        newBoard.cells = this.cells;
        newBoard.history = this.history;
        newBoard.currentPlayer = this.currentPlayer;
        newBoard.check = this.check;
        newBoard.checkmate = this.checkmate;
        newBoard.blackEatedFigures = this.blackEatedFigures;
        newBoard.whiteEatedFigures = this.whiteEatedFigures;
        return newBoard;
    }

    public getCells() : Cell[][]{
        return this.cells;
    }
    public getHistory() : move[]{
        return this.history;
    }
    public getCurrentPlayer() : Colors{
        return this.currentPlayer;
    }
    public getCheck() : Colors | null{
        return this.check;
    }
    public getCheckmate() : Colors | null{
        return this.checkmate;
    }
    public getBlackEatedFigures() : Figure[]{
        return this.blackEatedFigures;
    }
    public getWhiteEatedFigures() : Figure[]{
        return this.whiteEatedFigures;
    }

    private cycleMovement(isY : Direction, startY : number, startX : number, ourColor : Colors) : void{
        for(let isX = Number(isY !== Direction.Vertical); !(isX < -1); isX -= 2 + Number(isY === Direction.Horizontal)){
            for(let dir = 1; dir !== -3; dir -= 2){
                for(let y : number = startY + isY * dir, x : number = startX + isX * dir;
                y !== 8 && y !== -1 && x !== 8 && x !== -1;
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

    private canCastling(kingCell : Cell){
        const kingColor : Colors | undefined = kingCell.getFigure()?.getColor();
        if(kingColor != undefined){
            //Если Король Не под Шахом
            if(this.check !== kingColor){
                let canShortCastling : boolean = true;
                let canLongCastling : boolean = true;
                //Проверка на то Совершал ли Движение Король или Ладьи
                for(const move of this.history){
                    if(move.figure.type === FiguresType.King && move.figure.color === kingColor){
                        canShortCastling = false;
                        canLongCastling = false;
                        break;
                    }
                    if(move.figure.type === FiguresType.Rook && move.figure.color === kingColor){
                        if(!move.oldCoord.x && (move.oldCoord.y === 7 || !move.oldCoord.y)){
                            canLongCastling = false;
                        }else if(move.oldCoord.x === 7 && (move.oldCoord.y === 7 || !move.oldCoord.y)){
                            canShortCastling = false;
                        }
                    }
                }
                let canCastlings : boolean[] = [canShortCastling, canLongCastling];
                for(let dir : number = 1, can : number = 0; dir !== -3; dir-=2, can++){
                    if(canCastlings[can]){
                        //Проверка на то Есть ли Фигуры между Королём и Ладьёй
                        for(let x : number = 4 + dir; x !== 0 && x !== 7; x += dir){
                            if(this.cells[kingCell.getY()][x].getFigure()){
                                canCastlings[can] = false;
                                break;
                            }
                        }
                        const enemyColor : Colors = Number(!Boolean(kingColor));
                        for(let y : number = 0; y !== 8 && canCastlings[can]; y++){
                            for(let x : number = 0; x !== 8; x++){
                                if(this.cells[y][x].getFigure()?.getColor() === enemyColor){
                                    this.answerIsAvailable(this.cells[y][x]); 
                                    if(this.cells[kingCell.getY()][kingCell.getX() + dir].isAvailable() ||
                                    this.cells[kingCell.getY()][kingCell.getX() + dir * 2].isAvailable()){
                                        canCastlings[can] = false;
                                        this.nullingAvailable();
                                        break;
                                    }
                                    this.nullingAvailable();
                                }
                            }
                        }
                    }
                }
                if(canCastlings[0]){
                    this.cells[kingCell.getY()][kingCell.getX() + 2].makeAvailable();
                }
                if(canCastlings[1]){
                    this.cells[kingCell.getY()][kingCell.getX() - 2].makeAvailable();
                }
            }
        }
    }
    private canEnPassanat(pawnCell : Cell){
        const pawnColor : Colors | undefined = pawnCell.getFigure()?.getColor();
        if(pawnColor !== undefined){
            const pawnDir : number = ((!pawnColor) ? 1 : -1);
            const enemyColor : Colors = Number(!Boolean(pawnColor));
            const lastMove : move = this.history[this.history.length - 1];
            for(let dir : number = 1; dir !== -3; dir-=2){
                if(pawnCell.getX() + dir !== 8 && pawnCell.getX() + dir !== -1){
                    const figureNear : Figure | null = this.cells[pawnCell.getY()][pawnCell.getX() + dir].getFigure();
                    if(figureNear?.getType() === FiguresType.Pawn && figureNear?.getColor() === enemyColor &&
                    lastMove.newCoord.x === pawnCell.getX() + dir && lastMove.newCoord.y === pawnCell.getY()){
                        this.cells[pawnCell.getY() + pawnDir][pawnCell.getX() + dir].makeAvailable();
                    }
                }
            }
        }
    }
    public answerIsAvailable(cell : Cell, 
        kingInSafe : boolean = false, 
        needCastling : boolean = false, needEnPassanat : boolean = false
    ) : void{
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
            case FiguresType.King:{
                const enemyColor = Number(!Boolean(figureCell.getColor()));
                const startX : number = ((cell.getX() - 1 !== -1) ? cell.getX() - 1 : cell.getX());
                const endX : number = ((cell.getX() + 1 !== 8) ? cell.getX() + 2 : cell.getX() + 1);
                const startY : number = ((cell.getY() - 1 !== -1) ? cell.getY() - 1 : cell.getY());
                const endY : number = ((cell.getY() + 1 !== 8) ? cell.getY() + 2 : cell.getY() + 1);
                let availables : coord[] = [];
                if(!kingInSafe){
                    this.cells[cell.getY()][cell.getX()].deleteFigure();
                    //---------Возле Короля---------
                    for(let yAroundKing : number = startY; yAroundKing < endY; yAroundKing++){
                        for(let xAroundKing : number = startX; xAroundKing < endX; xAroundKing++){
                            /*---------Если Ячейка != Ячейке на Которой Находиться Король 
                            И на Ячейке Либо нету Фигуры, Либо Фигура Врага*/
                            if((yAroundKing !== cell.getY() || xAroundKing !== cell.getX()) &&
                            this.cells[yAroundKing][xAroundKing].getFigure()?.getColor() !== figureCell.getColor()){
                                let isUnderAttack : boolean = false;
                                let prollyFigure : Figure | undefined = this.cells[yAroundKing][xAroundKing].getFigure()?.getCopy();
                                this.cells[yAroundKing][xAroundKing].setFigure(figureCell);
                                //---------Поиск Потенциально Опасной Фигуры---------
                                for(let yAggressive : number = 0; yAggressive !== 8 && !isUnderAttack; yAggressive++){
                                    for(let xAggresive : number = 0; xAggresive !== 8 && !isUnderAttack; xAggresive++){
                                        if(this.cells[yAggressive][xAggresive].getFigure()?.getColor() === enemyColor){
                                            this.answerIsAvailable(this.cells[yAggressive][xAggresive], true);
                                            //---------Проход по Доступным для Хода Ячейкам Потенциально Опасной Фигуры---------
                                            for(let yAvailable : number = 0; yAvailable !== 8 && !isUnderAttack; yAvailable++){
                                                for(let xAvailable : number = 0; xAvailable !== 8; xAvailable++){
                                                    if(this.cells[yAvailable][xAvailable].isAvailable() &&
                                                    yAvailable === yAroundKing && xAvailable === xAroundKing){
                                                        isUnderAttack = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            this.nullingAvailable();
                                        }
                                    }
                                }
                                if(prollyFigure === undefined){
                                    this.cells[yAroundKing][xAroundKing].deleteFigure();
                                }else{
                                    this.cells[yAroundKing][xAroundKing].setFigure(prollyFigure);
                                }
                                if(!isUnderAttack){
                                    availables.push({y: yAroundKing, x: xAroundKing});
                                }
                            }
                        }
                    }
                    this.cells[cell.getY()][cell.getX()].setFigure(figureCell);
                    if(!needCastling){
                        for(const available of availables){
                            this.cells[available.y][available.x].makeAvailable();
                        }
                    }
                }else{
                    for(let yAroundKing : number = startY; yAroundKing !== endY; yAroundKing++){
                        for(let xAroundKing : number = startX; xAroundKing !== endX; xAroundKing++){
                            if((yAroundKing !== cell.getY() || xAroundKing !== cell.getX()) &&
                            this.cells[yAroundKing][xAroundKing].getFigure()?.getColor() !== figureCell.getColor()){
                                this.cells[yAroundKing][xAroundKing].makeAvailable();
                            }
                        }
                    }
                }
                if(needCastling){
                    this.canCastling(cell);
                    for(const available of availables){
                        this.cells[available.y][available.x].makeAvailable();
                    }
                }
                break;
            }
            case FiguresType.Pawn:{
                const pawnDir : number = (figureCell.getColor() === Colors.White) ? -1 : 1;
                const end : number = 2 + Number((figureCell.getColor() === Colors.White && cell.getY() === 6) ||
                    (figureCell.getColor() === Colors.Black && cell.getY() === 1));
                const enemyColor = Number(!Boolean(figureCell.getColor()));
                if(pawnDir + cell.getY() !== -1 && pawnDir + cell.getY() !== 8){
                    for(let yShift : number = 1 * pawnDir; yShift !== end * pawnDir; yShift+=pawnDir){
                        if(yShift + cell.getY() !== -1 && yShift + cell.getY() !== 8 && 
                        !this.cells[yShift + cell.getY()][cell.getX()].getFigure()){
                            this.cells[yShift + cell.getY()][cell.getX()].makeAvailable();
                        }else{
                            break;
                        }
                    }

                    for(let xShift : number = 1; xShift !== -3; xShift -= 2){
                        if(xShift + cell.getX() !== 8 && xShift + cell.getX() !== -1){
                            if(this.cells[cell.getY() + pawnDir][cell.getX() + xShift].getFigure()?.getColor() === enemyColor){
                                this.cells[cell.getY() + pawnDir][cell.getX() + xShift].makeAvailable();
                            }
                        }
                    }
                    if(needEnPassanat){
                        this.canEnPassanat(cell);
                    }
                }
                break;
            }
            case FiguresType.Knight:
                for(let yShift : number = -2; yShift !== 3; yShift++){
                    if(!yShift)
                        yShift++;
                    if(!(yShift + cell.getY() < 0) && yShift + cell.getY() < 8){
                        for(let xShift : number = -2 + Number(Math.abs(yShift) === 2); 
                        !(xShift > 2); 
                        xShift += 2 * (2 - Number(Math.abs(yShift) === 2))){
                            if(!(xShift + cell.getX() < 0) && xShift + cell.getX() < 8){
                                if(this.cells[yShift + cell.getY()][xShift + cell.getX()].getFigure()?.getColor() 
                                    !== figureCell.getColor()){
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
        for(let y : number = 0; y !== 8; y++){
            for(let x : number = 0; x !== 8; x++){
                this.cells[y][x].makeUnAvailable();
            }
        }
    }

    private isKingUnderAttack(passivePlayer : Colors, currentPlayer : Colors) : void{
        //Ищем Короля
        let checkableKing : null | Cell = null; 
        for(let y : number = 0; y !== 8 && checkableKing === null; y++){
            for(let x : number = 0; x !== 8; x++){
                if(this.cells[y][x].getFigure()?.getType() === FiguresType.King &&
                this.cells[y][x].getFigure()?.getColor() === passivePlayer){
                    checkableKing = this.cells[y][x];
                    break;
                }
            }
        }
        if(checkableKing){
            let isKingUnderCheckmate : boolean = false;
            let isKingInDangerous    : boolean = false;
            for(let yAggressive : number = 0; yAggressive !== 8 && !isKingUnderCheckmate; yAggressive++){
                for(let xAggresive : number = 0; xAggresive !== 8; xAggresive++){
                    let aggresiveCell : Cell = this.cells[yAggressive][xAggresive];
                    if(aggresiveCell.getFigure()?.getColor() === currentPlayer){
                        this.answerIsAvailable(aggresiveCell);
                        if(checkableKing.isAvailable()){
                            isKingInDangerous = true;
                            this.check = passivePlayer;

                            this.nullingAvailable();
                            this.answerIsAvailable(checkableKing);
                            let kingCanMove : boolean = false;

                            const startX : number = ((checkableKing.getX() - 1 !== -1) ? checkableKing.getX() - 1 : checkableKing.getX());
                            const endX   : number = ((checkableKing.getX() + 1 !== 8) ? checkableKing.getX() + 2 : checkableKing.getX() + 1);
                            const startY : number = ((checkableKing.getY() - 1 !== -1) ? checkableKing.getY() - 1 : checkableKing.getY());
                            const endY   : number = ((checkableKing.getY() + 1 !== 8) ? checkableKing.getY() + 2 : checkableKing.getY() + 1);
                            for(let y : number = startY; y !== endY && !kingCanMove; y++){
                                for(let x : number = startX; x !== endX; x++){
                                    if(this.cells[y][x].isAvailable()){
                                        kingCanMove = true;
                                        break;
                                    }
                                }
                            }
                            if(!kingCanMove){
                                let canSaveKing : boolean = false
                                for(let yRescuer : number = 0; yRescuer !== 8 && !canSaveKing; yRescuer++){
                                    for(let xRescuer : number = 0; xRescuer !== 8 && !canSaveKing; xRescuer++){
                                        let rescuerFigure : Figure | null = this.cells[yRescuer][xRescuer].getFigure();
                                        if(rescuerFigure?.getColor() === passivePlayer){
                                            this.nullingAvailable();
                                            this.answerIsAvailable(this.cells[yRescuer][xRescuer]);
                                            if(aggresiveCell.isAvailable()){
                                                this.nullingAvailable();
                                                canSaveKing = true;
                                                break;
                                            }else{
                                                for(let yAvailable : number = 0; yAvailable !== 8 && !canSaveKing; yAvailable++){
                                                    for(let xAvailable : number = 0; xAvailable !== 8; xAvailable++){
                                                        let availableCell = this.cells[yAvailable][xAvailable];
                                                        if(availableCell.isAvailable()){
                                                            let availableFigure : Figure | undefined = availableCell.getFigure()?.getCopy();
                                                            availableCell.setFigure(rescuerFigure);
                                                            this.nullingAvailable();
                                                            this.answerIsAvailable(aggresiveCell);
                                                            if(!checkableKing.isAvailable()){
                                                                this.nullingAvailable();
                                                                if(availableFigure !== undefined){
                                                                    availableCell.setFigure(availableFigure)
                                                                }else{
                                                                    availableCell.deleteFigure();
                                                                }
                                                                canSaveKing = true;
                                                                break;
                                                            }else{
                                                                this.nullingAvailable();
                                                                if(availableFigure !== undefined){
                                                                    availableCell.setFigure(availableFigure)
                                                                }else{
                                                                    availableCell.deleteFigure();
                                                                }
                                                                this.answerIsAvailable(this.cells[yRescuer][xRescuer]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if(!canSaveKing){
                                    isKingUnderCheckmate = true;
                                    this.checkmate = passivePlayer;
                                    break;
                                }
                            }
                        }else{
                            this.nullingAvailable();
                        }
                    }
                }
            }
            if(!isKingInDangerous && this.check !== null){
                this.check = null;
            }
        }
    }
    public moveFigure(oldCell : Cell, newCell : Cell) : void{
        this.nullingAvailable();
        const figure = oldCell.getFigure();
        const eatedFigure : Figure | null = this.cells[newCell.getY()][newCell.getX()].getFigure();
        if(figure){
            this.cells[newCell.getY()][newCell.getX()].setFigure(figure);
            this.cells[oldCell.getY()][oldCell.getX()].deleteFigure();
            if(figure.getType() === FiguresType.King){
                const rook = new Rook(figure.getColor());
                if(newCell.getX() === oldCell.getX() + 2){
                    this.cells[newCell.getY()][5].setFigure(rook);
                    this.cells[newCell.getY()][7].deleteFigure();
                }else if(newCell.getX() === oldCell.getX() - 2){
                    this.cells[newCell.getY()][3].setFigure(rook);
                    this.cells[newCell.getY()][0].deleteFigure();
                }
            }else if(figure.getType() === FiguresType.Pawn && !eatedFigure && 
            (newCell.getX() === oldCell.getX() + 1 || newCell.getX() === oldCell.getX() - 1)){
                const reversePawnDir : number = ((!figure.getColor()) ? -1 : 1)

                const eatedPawn : Figure | null = this.cells[newCell.getY() + reversePawnDir][newCell.getX()].getFigure();
                if(eatedPawn?.getColor() === Colors.White){
                    this.whiteEatedFigures.push(eatedPawn);
                }else if(eatedPawn?.getColor() === Colors.Black){
                    this.blackEatedFigures.push(eatedPawn);
                }

                this.cells[newCell.getY() + reversePawnDir][newCell.getX()].deleteFigure();
            }
            if(eatedFigure){
                if(eatedFigure.getColor() === Colors.White){
                    this.whiteEatedFigures.push(eatedFigure);
                }else{
                    this.blackEatedFigures.push(eatedFigure);
                }
            }
            
            this.isKingUnderAttack(figure.getColor(), Number(!Boolean(figure.getColor())))
            if(this.check === null){
                this.isKingUnderAttack(Number(!Boolean(figure.getColor())), figure.getColor())
            }else{
                this.checkmate = this.check;
            }
            this.history.push({
                figure:      {type: figure.getType(), color: figure.getColor(), src: figure.getSrc()},
                oldCoord:    {x: oldCell.getX(), y: oldCell.getY()},
                newCoord:    {x: newCell.getX(), y: newCell.getY()},
                check:     this.check,
                checkmate: this.checkmate,
            })
            this.currentPlayer = Number(!Boolean(this.currentPlayer));
        }
    }
}

export default Board;