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
        this.moveHistory.push(move);
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
    /** @type {Coord} */
    static selectedCoord;
    /** @type {Array<Move>} */
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
        let kingCoord = board.findCoordOfPieces(color, PieceType.KING)[0];
        return this.isCellUnderAttack(kingCoord, color, board);
    }
    static isAnyPieceMovable(color) {
        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                let crd = new Coord(i, j);
                let pc = Game.board.getPiece(crd);
                if(pc != null && pc.color == color) {
                    if(this.getLegalMoves(crd).length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    static isCellUnderAttack(coord, color, board = Game.board) {
        return this.isCellUnderAttackByKing(coord, color, board)
            || this.isCellUnderAttackInCross(coord, color, board)
            || this.isCellUnderAttackInDiagonal(coord, color, board)
            || this.isCellUnderAttackByKnight(coord, color, board)
            || this.isCellUnderAttackByPawn(coord, color, board);
    }
    static isCellUnderAttackByKing(coord, color, board = Game.board) {
        let opColor = Color.opponent(color);
        let rowDiffs = new Array(-1, -1, -1,  0, 0,  1, 1, 1);
        let colDiffs = new Array(-1,  0,  1, -1, 1, -1, 0, 1);
        for (let i = 0; i < 8; i++) {
            let crd = new Coord(coord.r + rowDiffs[i], coord.c + colDiffs[i]);
            let pc = Game.board.getPiece(crd);
            if(pc != null && pc.type == PieceType.KING && pc.color == opColor) {
                return true;
            }
        }
        return false;
    }
    static isCellUnderAttackInCross(coord, color, board = Game.board) {

    }
    static isCellUnderAttackInDiagonal(coord, color, board = Game.board) {

    }
    static isCellUnderAttackByKnight(coord, color, board = Game.board) {
        let opColor = Color.opponent(color);
        let rowDiffs = new Array(-2, -2, -1, -1,  1, 1,  2, 2);
        let colDiffs = new Array(-1,  1, -2,  2, -2, 2, -1, 1);
        for (let i = 0; i < 8; i++) {
            let crd = new Coord(coord.r + rowDiffs[i], coord.c + colDiffs[i]);
            let pc = Game.board.getPiece(crd);
            if(pc != null && pc.type == PieceType.KING && pc.color == opColor) {
                return true;
            }
        }
        return false;
    }
    static isCellUnderAttackByPawn(coord, color, board = Game.board) {

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
        let pseudoLegalMoves = new Array();
        let color = Game.board.getPiece(coord).color;
        let rowDiffs = new Array(-1, -1, -1,  0, 0,  1, 1, 1);
        let colDiffs = new Array(-1,  0,  1, -1, 1, -1, 0, 1);
        for (let i = 0; i < 8; i++) {
            let toCoord = new Coord(coord.r + rowDiffs[i], coord.c + colDiffs[i]);
            if (this.isCellEmptyOrEnemy(toCoord, color)) {
                pseudoLegalMoves.push(new Move(coord, toCoord));
            }
        }
        // Castling
        let c = (color == Color.WHITE)? 0 : 7;
        if(coord.r == 4 && coord.c == c && !this.hasAnyPieceMovedFrom(new Coord(4, c))) {
            let kingSide = Game.board.getPiece(new Coord(7, c));
            if (kingSide != null && kingSide.color == color
                && kingSide.type == PieceType.ROOK && !this.hasAnyPieceMovedFrom(new Coord(7, c))
                && !this.isCellUnderAttack(new Coord(4, c), color)
                && this.isCellEmpty(new Coord(5, c)) && !this.isCellUnderAttack(new Coord(5, c), color)
                && this.isCellEmpty(new Coord(6, c)) && !this.isCellUnderAttack(new Coord(6, c), color)
            ) {
                pseudoLegalMoves.push(new MoveCastling(MoveCastling.KING_SIDE_CASTLING, color));
            }
            let queenSide = Game.board.getPiece(new Coord(0, c));
            if (queenSide != null && queenSide.color == color
                && queenSide.type == PieceType.ROOK && !this.hasAnyPieceMovedFrom(new Coord(0, c))
                && !this.isCellUnderAttack(new Coord(4, c), color)
                && this.isCellEmpty(new Coord(3, c)) && !this.isCellUnderAttack(new Coord(3, c), color)
                && this.isCellEmpty(new Coord(2, c)) && !this.isCellUnderAttack(new Coord(2, c), color)
            ) {
                pseudoLegalMoves.push(new MoveCastling(MoveCastling.QUEEN_SIDE_CASTLING, color));
            }
        }
        return pseudoLegalMoves;
    }
    static hasAnyPieceMovedFrom(coord) {
        let hasMoved = false;
        for(let move of Game.moveHistory.values()) {
            hasMoved ||= move.fromCoord.r == coord.r && move.toCoord.c == coord.c;
        }
        return hasMoved;
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
        let pseudoLegalMoves = new Array();
        let color = Game.board.getPiece(coord).color;
        let rowDiffs = new Array(-2, -2, -1, -1,  1, 1,  2, 2);
        let colDiffs = new Array(-1,  1, -2,  2, -2, 2, -1, 1);
        for (let i = 0; i < 8; i++) {
            let toCoord = new Coord(coord.r + rowDiffs[i], coord.c + colDiffs[i]);
            if (this.isCellEmptyOrEnemy(toCoord, color)) {
                pseudoLegalMoves.push(new Move(coord, toCoord));
            }
        }
        return pseudoLegalMoves;
    }
    static getPseudoLegalMovesOfPawn(coord) {
        let pseudoLegalMoves = new Array();
        let color = Game.board.getPiece(coord).color;
        let frontDir = (color == Color.WHITE)? 1 : -1;
        let startCol = (color == Color.WHITE)? 1 : 6;
        let promotionCol = (color == Color.WHITE)? 6 : 1;
        let enPassantCol = (color == Color.WHITE)? 4 : 3;

        let frontCoord = new Coord(coord.r, coord.c + frontDir);
        let twiceFrontCoord = new Coord(coord.r, coord.c + frontDir * 2);
        if (this.isCellEmpty(frontCoord)) {
            if(coord.c == promotionCol) {
                pseudoLegalMoves.push(new MovePromotion(coord, frontCoord));
            } else {
                pseudoLegalMoves.push(new Move(coord, frontCoord));
            }

            if(coord.c == startCol && this.isCellEmpty(twiceFrontCoord)) {
                pseudoLegalMoves.push(new Move(coord, twiceFrontCoord));
            }
        }
        let diagonalCoord1 = new Coord(coord.r - 1, coord.c + frontDir);
        if (this.isCellEnemy(diagonalCoord1, color)) {
            if(coord.c == promotionCol) {
                pseudoLegalMoves.push(new MovePromotion(coord, diagonalCoord1));
            } else {
                pseudoLegalMoves.push(new Move(coord, diagonalCoord1));
            }
        }
        let diagonalCoord2 = new Coord(coord.r + 1, coord.c + frontDir);
        if (this.isCellEnemy(diagonalCoord2, color)) {
            if(coord.c == promotionCol) {
                pseudoLegalMoves.push(new MovePromotion(coord, diagonalCoord2));
            } else {
                pseudoLegalMoves.push(new Move(coord, diagonalCoord2));
            }
        }
        // En passant
        let sideCoord1 = new Coord(coord.r - 1, coord.c);
        if (coord.c == enPassantCol && this.isCellEnemy(sideCoord1, color)) {
            let enemy = Game.board.getPiece(sideCoord1);
            if(enemy.type == PieceType.PAWN && this.isLastMovedPieceAt(coord)) {
                let lastMove = Game.moveHistory[Game.moveHistory.length - 1];
                if(Math.abs(lastMove.fromCoord.c - lastMove.toCoord.c) == 2) {
                    pseudoLegalMoves.push(new MoveEnPassant(coord, sideCoord1));
                }
            }
        }
        let sideCoord2 = new Coord(coord.r + 1, coord.c);
        if (coord.c == enPassantCol && this.isCellEnemy(sideCoord2, color)) {
            let enemy = Game.board.getPiece(sideCoord2);
            if(enemy.type == PieceType.PAWN && this.isLastMovedPieceAt(coord)) {
                let lastMove = Game.moveHistory[Game.moveHistory.length - 1];
                if(Math.abs(lastMove.fromCoord.c - lastMove.toCoord.c) == 2) {
                    pseudoLegalMoves.push(new MoveEnPassant(coord, sideCoord2));
                }
            }
        }
        return pseudoLegalMoves;
    }
    static isLastMovedPieceAt(coord) {
        let lastMove = Game.moveHistory[Game.moveHistory.length - 1];
        return lastMove.toCoord.equals(coord);
    }

    static getLinearPseudoLegalMoves(coord, rowDir, colDir) {
        let linearPseudoLegalMoves = new Array();
        let color = Game.board.getPiece(coord).color;
        for (let i = 1; i < 8; i++) {
            let searchingCoord = new Coord(coord.r + i*rowDir, coord.c + i*colDir);
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
    static KING_SIDE_CASTLING = 'ksc-6-O-O';
    static QUEEN_SIDE_CASTLING = 'qsc-2-O-O-O';

    constructor(castlingSide, color) {
        this.castlingSide = castlingSide;
        this.color = color;
        
        let column = (color == Color.WHITE)? 0 : 7;
        let rowTo = parseInt(castlingSide[4]);
        this.fromCoord = new Coord(4, column);
        this.toCoord = new Coord(rowTo, column);
        this.movingPiece = Game.board.getPiece(fromCoord);
        this.capturedPiece = null;
    }
}

class MoveEnPassant extends Move {
    constructor(fromCoord, toCoord) {
        this.fromCoord = fromCoord;
        this.toCoord = toCoord;

        this.movingPiece = Game.board.getPiece(fromCoord);
        this.capturedPiece = Game.board.getPiece(toCoord);
        // this.color = (fromCoord.c == 4)? Color.WHITE : Color.BLACK;
    }
}

class MovePromotion extends Move {
    constructor(fromCoord, toCoord, type = undefined) {
        this.fromCoord = fromCoord;
        this.toCoord = toCoord;
        this.type = type;
        
        this.movingPiece = Game.board.getPiece(fromCoord);
        this.capturedPiece = Game.board.getPiece(toCoord);
        // this.color = Game.board.getPiece(fromCoord).color;
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
    findCoordOfPieces(color, type) {
        let pieceCoords = new Array();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let p = this.arr[i][j];
                if(p.color == color && p.type == type) {
                    pieceCoords.push(p);
                }
            }
        }
        return pieceCoords;
    }
}

class Coord {
    constructor(r, c) {
        this.r = r;
        this.c = c;
    }

    equals(another) {
        return this.r == another.r && this.c == another.c;
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