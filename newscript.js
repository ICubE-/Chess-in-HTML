class Game {
    /** @type {number} */
    static halfMoveCount;
    /** @type {Color} */
    static turn;
    /** @type {Board} */
    static board;
    /** @type {Array<Move>} */
    static moveHistory;

    static start() {
        this.halfMoveCount = 0;
        this.turn = Color.WHITE;

        this.board = new Board();
        this.board.setup();

        this.moveHistory = new Array();
    }
    static do(move) {
        this.board.doMove(move);
        // detect mate
        // update move's info
        // end if mate

        this.halfMoveCount++;
        this.turn = Color.opponent(this.turn);
        // update move history
    }
    static undo(move) {

    }
    static end(winColor) {
        if(winColor == Color.WHITE) {
            //
        } else if(winColor == Color.BLACK) {
            //
        } else {
            //
        }
    }
}

class GameControl {
    static selectedCoord;
    static availableMoves;

    static unselectPiece() {

    }
    static selectPiece() {

    }
    static doMove() {

    }
}

class GameUI {

}

class GameLogic {
    static isInCheckmate(color) {
        return this.isInCheck(color) && this.isAnyPieceMovable(color);
    }
    static isInStalemate(color) {
        return !this.isInCheck(color) && this.isAnyPieceMovable(color);
    }

    static isInCheck(color, board = Game.board) {

    }
    static isAnyPieceMovable(color) {

    }

    static getLegalMoves(coord) {
        let legalMoves = new Array();
        let pseudoLegalMoves = this.getPseudoLegalMoves(coord);
        for (let mv of pseudoLegalMoves.values()) {
            let color = Game.board.getPiece(coord).color;
            let tmpBoard = Game.board.clone();
            tmpBoard.doMove(mv);
            if (!this.isInCheck(color, tmpBoard)) {
                legalMoves.push(mv);
            }
        }
        return legalMoves;
    }
    static getPseudoLegalMoves(coord) {
        let piece = Game.board.getPiece(coord);
        switch(piece.type) {
            case PieceType.KING:
                return this.getPseudoLegalMovesOfKing(coord);
            case PieceType.QUEEN:
                return this.getPseudoLegalMovesOfQueen(coord);
            case PieceType.ROOK:
                return this.getPseudoLegalMovesOfRook(coord);
            case PieceType.BISHOP:
                return this.getPseudoLegalMovesOfBishop(coord);
            case PieceType.KNIGHT:
                return this.getPseudoLegalMovesOfKnight(coord);
            case PieceType.PAWN:
                return this.getPseudoLegalMovesOfPawn(coord);
            default:
                return undefined;
        }
    }
    static getPseudoLegalMovesOfKing(coord) {

    }
    static getPseudoLegalMovesOfQueen(coord) {
        let tmp = new Array();
        tmp.push(this.getLinearPseudoLegalMoves(coord, -1, -1));
        tmp.push(this.getLinearPseudoLegalMoves(coord, -1,  0));
        tmp.push(this.getLinearPseudoLegalMoves(coord, -1,  1));
        tmp.push(this.getLinearPseudoLegalMoves(coord,  0, -1));
        tmp.push(this.getLinearPseudoLegalMoves(coord,  0,  1));
        tmp.push(this.getLinearPseudoLegalMoves(coord,  1, -1));
        tmp.push(this.getLinearPseudoLegalMoves(coord,  1,  0));
        tmp.push(this.getLinearPseudoLegalMoves(coord,  1,  1));
        return tmp.flat();
    }
    static getPseudoLegalMovesOfRook(coord) {
        let tmp = new Array();
        tmp.push(this.getLinearPseudoLegalMoves(coord, -1,  0));
        tmp.push(this.getLinearPseudoLegalMoves(coord,  0, -1));
        tmp.push(this.getLinearPseudoLegalMoves(coord,  0,  1));
        tmp.push(this.getLinearPseudoLegalMoves(coord,  1,  0));
        return tmp.flat();
    }
    static getPseudoLegalMovesOfBishop(coord) {
        let tmp = new Array();
        tmp.push(this.getLinearPseudoLegalMoves(coord, -1, -1));
        tmp.push(this.getLinearPseudoLegalMoves(coord, -1,  1));
        tmp.push(this.getLinearPseudoLegalMoves(coord,  1, -1));
        tmp.push(this.getLinearPseudoLegalMoves(coord,  1,  1));
        return tmp.flat();
    }
    static getPseudoLegalMovesOfKnight(coord) {
        
    }
    static getPseudoLegalMovesOfPawn(coord) {
        
    }

    static getLinearPseudoLegalMoves(coord, rowdir, coldir) {
        let color = Game.board.getPiece(coord).color;
        let linearPseudoLegalMoves = new Array();
        for (let i = 1; i < 8; i++) {
            let searchingCoord = new Coord(coord.r + i*rowdir, coord.c + i*coldir);
            if (!searchingCoord.isOnBoard()) {
                break;
            }
            if(this.isCellEmpty(searchingCoord)) {
                linearPseudoLegalMoves.push(new Move(coord, searchingCoord));
            } else {
                if(this.isCellEnemy(searchingCoord, color)) {
                    linearPseudoLegalMoves.push(new Move(coord, searchingCoord));
                }
                break;
            }
        }
        return linearPseudoLegalMoves;
    }

    static isCellEmpty(coord) {
        return coord.isOnBoard() && Game.board.getPiece(coord) == null;
    }
    static isCellEnemy(coord, color) {
        let piece = Game.board.getPiece(coord);
        return coord.isOnBoard() && piece != null && piece.color != color;
    }
    static isCellEmptyOrEnemy(coord, color) {
        return this.isCellEmpty(coord) || this.isCellEnemy(coord, color);
    }
}

class Move {
    constructor(fromCoord, toCoord) {
        this.fromCoord = fromCoord;
        this.toCoord = toCoord;

        this.movingPiece = Game.board.getPiece(fromCoord);
        this.capturedPiece = Game.board.getPiece(toCoord);
    }
}

class MoveCastling extends Move {
    static KING_SIDE_CASTLING = 'ksc';
    static QUEEN_SIDE_CASTLING = 'qsc';

    constructor(castlingSide, color) {
        this.castlingSide = castlingSide;
        this.color = color;
    }
}

class MoveEnPassant extends Move {
    constructor(fromCoord, toCoord, color) {
        this.fromCoord = fromCoord;
        this.toCoord = toCoord;
        this.color = color;
    }
}

class MovePromotion extends Move {
    constructor(fromCoord, toCoord, color, type, capturedPiece) {
        this.fromCoord = fromCoord;
        this.toCoord = toCoord;
        this.color = color;
        this.type = type;
        this.capturedPiece = capturedPiece;
    }
}

class Board {
    constructor() {
        /** @type {Array<Array<Piece>>} */
        this.arr;

        this.clear();
    }
    clear() {
        this.arr = new Array();
        for (let i = 0; i < 8; i++) {
            let r = new Array(8);
            r.fill(null);
            this.arr.push(r);
        }
    }
    setup() {
        this.clear();
        this.createPiece(Color.WHITE, PieceType.ROOK,   new Coord(0, 0));
        this.createPiece(Color.WHITE, PieceType.KNIGHT, new Coord(1, 0));
        this.createPiece(Color.WHITE, PieceType.BISHOP, new Coord(2, 0));
        this.createPiece(Color.WHITE, PieceType.QUEEN,  new Coord(3, 0));
        this.createPiece(Color.WHITE, PieceType.KING,   new Coord(4, 0));
        this.createPiece(Color.WHITE, PieceType.BISHOP, new Coord(5, 0));
        this.createPiece(Color.WHITE, PieceType.KNIGHT, new Coord(6, 0));
        this.createPiece(Color.WHITE, PieceType.ROOK,   new Coord(7, 0));
        this.createPiece(Color.WHITE, PieceType.PAWN,   new Coord(0, 1));
        this.createPiece(Color.WHITE, PieceType.PAWN,   new Coord(1, 1));
        this.createPiece(Color.WHITE, PieceType.PAWN,   new Coord(2, 1));
        this.createPiece(Color.WHITE, PieceType.PAWN,   new Coord(3, 1));
        this.createPiece(Color.WHITE, PieceType.PAWN,   new Coord(4, 1));
        this.createPiece(Color.WHITE, PieceType.PAWN,   new Coord(5, 1));
        this.createPiece(Color.WHITE, PieceType.PAWN,   new Coord(6, 1));
        this.createPiece(Color.WHITE, PieceType.PAWN,   new Coord(7, 1));
        this.createPiece(Color.BLACK, PieceType.PAWN,   new Coord(0, 6));
        this.createPiece(Color.BLACK, PieceType.PAWN,   new Coord(1, 6));
        this.createPiece(Color.BLACK, PieceType.PAWN,   new Coord(2, 6));
        this.createPiece(Color.BLACK, PieceType.PAWN,   new Coord(3, 6));
        this.createPiece(Color.BLACK, PieceType.PAWN,   new Coord(4, 6));
        this.createPiece(Color.BLACK, PieceType.PAWN,   new Coord(5, 6));
        this.createPiece(Color.BLACK, PieceType.PAWN,   new Coord(6, 6));
        this.createPiece(Color.BLACK, PieceType.PAWN,   new Coord(7, 6));
        this.createPiece(Color.BLACK, PieceType.ROOK,   new Coord(0, 7));
        this.createPiece(Color.BLACK, PieceType.KNIGHT, new Coord(1, 7));
        this.createPiece(Color.BLACK, PieceType.BISHOP, new Coord(2, 7));
        this.createPiece(Color.BLACK, PieceType.QUEEN,  new Coord(3, 7));
        this.createPiece(Color.BLACK, PieceType.KING,   new Coord(4, 7));
        this.createPiece(Color.BLACK, PieceType.BISHOP, new Coord(5, 7));
        this.createPiece(Color.BLACK, PieceType.KNIGHT, new Coord(6, 7));
        this.createPiece(Color.BLACK, PieceType.ROOK,   new Coord(7, 7));
    }

    doMove(move) {
        if(move instanceof MoveCastling) {
            this.doCastling(move);
        } else if(move instanceof MoveEnPassant) {
            this.doEnPassant(move);
        } else if(move instanceof MovePromotion) {
            this.doPromotion(move);
        } else {
            this.doCommonMove(move);
        }
    }
    doCommonMove(move) {
        this.movePiece(move.fromCoord, move.toCoord);
    }
    doCastling(castling) {
        let col;
        if(castling.color == Color.WHITE) {
            col = 0;
        } else {
            col = 7;
        }
        if(castling.castlingSide == MoveCastling.KING_SIDE_CASTLING) {
            this.movePiece(new Coord(4, col), new Coord(6, col));
            this.movePiece(new Coord(7, col), new Coord(5, col));
        } else {
            this.movePiece(new Coord(4, col), new Coord(2, col));
            this.movePiece(new Coord(0, col), new Coord(3, col));
        }
    }
    doEnPassant(enPassant) {
        this.movePiece(enPassant.fromCoord, enPassant.toCoord);
        this.removePiece(new Coord(enPassant.toCoord.r, enPassant.fromCoord.c));
    }
    doPromotion(promotion) {
        this.movePiece(promotion.fromCoord, promotion.toCoord);
        this.promotePiece(promotion.toCoord, promotion.type);
    }


    clone() {
        let clone = new Board();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                clone.arr[i][j] = this.arr[i][j].clone();
            }
        }
        return clone;
    }
    getPiece(coord) {
        return this.arr[coord.r][coord.c];
    }
    createPiece(color, type, coord) {
        this.arr[coord.r][coord.c] = new Piece(color, type);
    }
    removePiece(coord) {
        this.arr[coord.r][coord.c] = null;
    }
    movePiece(fromCoord, toCoord) {
        this.arr[toCoord.r][toCoord.c] = this.arr[fromCoord.r][fromCoord.c];
        this.arr[fromCoord.r][fromCoord.c] = null;
    }
    promotePiece(coord, type) {
        this.arr[coord.r][coord.c].type = type;
    }
}

class Coord {
    constructor(r, c) {
        this.r = r;
        this.c = c;
    }

    isOnBoard() {
        return this.r >= 0 && this.r < 8 && this.c >= 0 && this.c < 8;
    }
}

class Piece {
    constructor(color, type) {
        this.color = color;
        this.type = type;
    }
    
    clone() {
        return new Piece(this.color, this.type);
    }
}

class Color {
    static WHITE = 'wh';
    static BLACK = 'bl';

    static opponent(color) {
        return (color == Color.WHITE)? Color.BLACK : Color.WHITE;
    }
}

class PieceType {
    static KING = 'k';
    static QUEEN = 'q';
    static ROOK = 'r';
    static BISHOP = 'b';
    static KNIGHT = 'n';
    static PAWN = 'p';
}