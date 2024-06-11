export enum Direction{
    Horizontal = "horizontal",
    Vertical = "vertical",
}

export enum Colors{
    Black = 0,
    White = 1,
}

export enum FiguresType{
    Default = "Default",
    Pawn = "Pawn",
    Rook = "Rook",
    Knight = "Knight",
    Bishop = "Bishop",
    King = "King",
    Queen = "Queen",
}

//----------PickerWindow----------
export enum Consent{
    Yes = "Yes",
    No = "No"
}

export enum ListType{
    Figure,
    Consent,
}

//----------Board----------
export interface coord{
    x: number,
    y: number,
}

//----------Moves History Window----------
export interface pseudoFigure{
    type : FiguresType,
    color : Colors,
    src : string;
}

export interface pseudoCell{
    x : number,
    y : number,
    color : Colors,
    figure : pseudoFigure | null,
}

export interface pseudoBoard{
    cells : pseudoCell[][];
}

//----------Moves History Window + Board----------
export interface move{
    figure      : pseudoFigure,
    oldCoord    : coord,
    newCoord    : coord,
    check     : Colors | null,
    checkmate : Colors | null,
}

//----------Picker Window----------
interface htmlTag{
    content : string;
    value : Consent | FiguresType;
}

export interface list{
    type : ListType,
    items : htmlTag[]
}