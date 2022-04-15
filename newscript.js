class Game {
    static halfMoveCount;
    static turn;
    static board;
    static moveHistory;

    static start() {
        this.halfMoveCount = 0;
        this.turn = Color.WHITE;

        this.board = new Board();
        this.board.setup();

        this.moveHistory = new Array();
    }
    static do(move) {
        if(move instanceof MoveCastling) {
            this.doCastling(move);
        } else if(move instanceof MoveEnPassant) {
            this.doEnPassant(move);
        } else if(move instanceof MovePromotion) {
            this.doPromotion(move);
        } else {
            this.doGeneralMove(move);
        }
        // detect mate
        // update move's info
        // end if mate
    }
    static undo(move) {

    }
    static end(winColor) {

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

class Move {
    constructor(fromCoord, toCoord, movingPiece, capturedPiece) {
        this.fromCoord = fromCoord;
        this.toCoord = toCoord;
        this.movingPiece = movingPiece;
        this.capturedPiece = capturedPiece;
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

}

class Coord {

}

class Piece {
    constructor(color, type, hasMoved = false) {
        this.color = color;
        this.type = type;
        this.hasMoved = hasMoved;
    }
}

class Color {
    static WHITE = 'wh';
    static BLACK = 'bl';
}

class PieceType {
    static KING = 'k';
    static QUEEN = 'q';
    static ROOK = 'r';
    static BISHOP = 'b';
    static KNIGHT = 'n';
    static PAWN = 'p';
}