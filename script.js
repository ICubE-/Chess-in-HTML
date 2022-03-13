class Piece {
    constructor(color, type, row, col, whenMove = 0) {
        // color: 'wh', 'bl'
        // type: 'k', 'q', 'r', 'b', 'n', 'p'
        this.color = color;
        this.type = type;
        this.row = row;
        this.col = col;
        this.whenMove = whenMove;
    }
    clone() {
        return new Piece(this.color, this.type, this.row, this.col, this.whenMove);
    }
}

class ChessLogic {
    constructor() {
        /** @type {Array<Array<Piece>>} */
		this.board = new Array();
        /** @type {Array<Piece>} */
        this.pieces = new Array();
        this.movesNumber = 0;
        this.clearBoard();
    }
	clearBoard() {
		this.board = new Array();
        for (let i = 0; i < 8; i++) {
            let r = new Array(8);
            r.fill(null);
            this.board.push(r);
        }
	}
    createPiece(color, type, row, col) {
        this.removePiece(row, col);
        let piece = new Piece(color, type, row, col, this.movesNumber);
        this.board[row][col] = piece;
        this.pieces.push(piece);
    }
    removePiece(row, col) {
        if(this.board[row][col] != null) {
            let piece = this.pieces.pop(this.board[row][col]);
            this.board[row][col] = null;
            return piece;
        } else return null;
    }
    /**
     * @param  {number} oldRow  The origin row of the piece.
     * @param  {number} oldCol  The origin column of the piece.
     * @param  {number} newRow  The destination row of the piece.
     * @param  {number} newCol  The destination column of the piece.
     */
    movePiece(oldRow, oldCol, newRow, newCol) {
        this.removePiece(newRow, newCol);
        let piece = this.board[oldRow][oldCol];
        piece.row = newRow;
        piece.col = newCol;
        this.movesNumber++;
        piece.whenMove = this.movesNumber;
        this.board[newRow][newCol] = piece;
        this.board[oldRow][oldCol] = null;
    }
    isCoordValid(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    getCoords(color, type) {
        // color: 'wh', 'bl'
        // type: 'k', 'q', 'r', 'b', 'n', 'p'
        let coords = new Array();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let pc = this.board[i][j];
                if (pc != null && pc.color == color && pc.type == type) {
                    coords.push(this.num2Coord(i, j));
                }
            }
        }
        return coords;
    }
    getPieces(color, type) {
        let pcs = new Array();
        for(let pc of this.pieces) {
            if(pc.color == color && pc.type == type) {
                pcs.push(pc);
            }
        }
        return pcs;
    }
    getOppositeColor(color) {
        return color == 'wh' ? 'bl' : 'wh';
    }
    num2Coord(row, col) {
        return new Array(row, col);
    }
    isCellEmpty(row, col) {
        return this.isCoordValid(row, col) && this.board[row][col] == null;
    }
    isCellEnemy(row, col, color) {
        return this.isCoordValid(row, col) 
        && this.board[row][col] != null 
        && this.board[row][col].color != color;
    }
    isCellEmptyOrEnemy(row, col, color) {
        return this.isCellEmpty(row, col) || this.isCellEnemy(row, col, color);
    }
    /**
     * Returns whether the king of a given color is in check or not.
     * @param  {string} color  Color of the king.
     * @returns  {boolean}  Whether the king is in check.
     */
    isInCheck(color) {
        // color: 'wh', 'bl'
        let king = this.getPieces(color, 'k')[0];
		let kx = king.row, ky = king.col;
        let oppositeColor = this.getOppositeColor(color);
        // check king
        for (let i = kx - 1; i <= kx + 1; i++) {
            for (let j = ky - 1; j <= ky + 1; j++) {
                if (this.isCoordValid(i, j) && this.board[i][j] != null) {
                    let pc = this.board[i][j];
                    if (pc.color == oppositeColor && pc.type == 'k') {
                        return true;
                    }
                }
            }
        }
        // check horizontal, vertical
        for (let i = kx - 1; i >= 0; i--) {
			if(this.board[i][ky] != null) {
				let pc = this.board[i][ky];
				if(pc.color == oppositeColor && (pc.type == 'q' || pc.type == 'r')) {
				   return true;
				}
				break;
			}
		}
		for (let i = kx + 1; i < 8; i++) {
			if(this.board[i][ky] != null) {
				let pc = this.board[i][ky];
				if(pc.color == oppositeColor && (pc.type == 'q' || pc.type == 'r')) {
				   return true;
				}
				break;
			}
		}
		for (let j = ky - 1; j >= 0; j--) {
			if(this.board[kx][j] != null) {
				let pc = this.board[kx][j];
				if(pc.color == oppositeColor && (pc.type == 'q' || pc.type == 'r')) {
				   return true;
				}
				break;
			}
		}
		for (let j = ky + 1; j < 8; j++) {
			if(this.board[kx][j] != null) {
				let pc = this.board[kx][j];
				if(pc.color == oppositeColor && (pc.type == 'q' || pc.type == 'r')) {
				   return true;
				}
				break;
			}
		}
		// check diagonal
		for (let i = 1; i < 7; i++) {
			if(!this.isCoordValid(kx - i, ky - i)) {
				break;
			}
			let pc = this.board[kx - i][ky - i];
			if(pc != null) {
				if(pc.color == oppositeColor && (pc.type == 'q' || pc.type == 'b')) {
				   return true;
				}
				break;
			}
		}
		for (let i = 1; i < 7; i++) {
			if(!this.isCoordValid(kx - i, ky + i)) {
				break;
			}
			let pc = this.board[kx - i][ky + i];
			if(pc != null) {
				if(pc.color == oppositeColor && (pc.type == 'q' || pc.type == 'b')) {
				   return true;
				}
				break;
			}
		}
		for (let i = 1; i < 7; i++) {
			if(!this.isCoordValid(kx + i, ky - i)) {
				break;
			}
			let pc = this.board[kx + i][ky - i];
			if(pc != null) {
				if(pc.color == oppositeColor && (pc.type == 'q' || pc.type == 'b')) {
				   return true;
				}
				break;
			}
		}
		for (let i = 1; i < 7; i++) {
			if(!this.isCoordValid(kx + i, ky + i)) {
				break;
			}
			let pc = this.board[kx + i][ky + i];
			if(pc != null) {
				if(pc.color == oppositeColor && (pc.type == 'q' || pc.type == 'b')) {
				   return true;
				}
				break;
			}
		}
		// check knight
		let knightX = new Array(-2, -2, -1, -1, 1, 1, 2, 2);
		let knightY = new Array(-1, 1, -2, 2, -2, 2, -1, 1);
		for(let i = 0; i < 8; i++) {
			let x = kx + knightX[i], y = ky + knightY[i];
			if (this.isCoordValid(x, y) && this.board[x][y] != null) {
				let pc = this.board[x][y];
				if (pc.color == oppositeColor && pc.type == 'n') {
					return true;
				}
			}
		}
		// check pawn
		let frontDir, px, py;
		if(color == 'wh') py = ky + 1;
		else py = ky - 1;
		px = kx - 1;
		if (this.isCoordValid(px, py) && this.board[px][py] != null) {
			let pc = this.board[px][py];
			if (pc.color == oppositeColor && pc.type == 'p') {
				return true;
			}
		}
		px = kx + 1;
		if (this.isCoordValid(px, py) && this.board[px][py] != null) {
			let pc = this.board[px][py];
			if (pc.color == oppositeColor && pc.type == 'p') {
				return true;
			}
		}

        return false;
    }
    /**
     * Returns the existence of a movable piece of a given color.
     * @param  {string} color  Color of the pieces.
     * @returns  {boolean}  Existence of a movable piece of the color.
     */
    isAnyPieceMovable(color) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let pc = this.board[i][j];
                if (pc != null && pc.color == color) {
                    if(this.getLegalMoveCoords(i, j).length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * Gets coordinates of pseudo legal moves in particular linear direction.
     * @param  {string} color  Color of the piece.
     * @param  {number} row  Row of the piece.
     * @param  {number} col  Column of the piece.
     * @param  {number} rowdir  Row direction used to search.
     * @param  {number} coldir  Column direction used to search.
     * @returns  {Array<Array<number>>}  Coordinates of pseudo legal moves in particular direction.
     */
    getLinearPseudoLegalMoveCoords(color, row, col, rowdir, coldir) {
        let linearPseudoLegalMoves = new Array();
        for(let i = 1; i < 7; i++) {
            let x = row + rowdir * i;
            let y = col + coldir * i;
            if(!this.isCoordValid(x, y)) {
                // if searching cell is out of the board
                break;
            }
            if(this.board[x][y] != null) {
                // if searching cell is a piece
                if(this.board[x][y].color != color) {
                    // if color of the piece is opposite
                    linearPseudoLegalMoves.push(this.num2Coord(x, y));
                }
                break;
            } else {
                // if searching cell is empty
                linearPseudoLegalMoves.push(this.num2Coord(x, y));
            }
        }
        return linearPseudoLegalMoves;
    }
    /**
     * Gets coordinates of pseudo legal moves.
     * Pseudo legal move: The move that the piece can do, without considering the check.
     * @param  {number} row  Row of the piece.
     * @param  {number} col  Column of the piece.
     * @returns  {Array<Array<number>>}  Coordinates of pseudo legal moves of the piece.
     */
    getPseudoLegalMoveCoords(row, col) {
		let pseudoLegalMoveCoords = new Array();
		let piece = this.board[row][col];
		if(piece.type == 'k') {
			for (let i = row - 1; i <= row + 1; i++) {
				for (let j = col - 1; j <= col + 1; j++) {
					if (this.isCellEmptyOrEnemy(i, j, piece.color)) {
						pseudoLegalMoveCoords.push(this.num2Coord(i, j));
					}
				}
			}
            // castling
		} else if(piece.type == 'q') {
            let tmp = new Array();
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col, -1, -1));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col, -1,  0));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col, -1,  1));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col,  0, -1));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col,  0,  1));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col,  1, -1));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col,  1,  0));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col,  1,  1));
            pseudoLegalMoveCoords = tmp.flat();
		} else if(piece.type == 'r') {
            let tmp = new Array();
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col, -1,  0));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col,  0, -1));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col,  0,  1));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col,  1,  0));
            pseudoLegalMoveCoords = tmp.flat();
		} else if(piece.type == 'b') {
            let tmp = new Array();
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col, -1, -1));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col, -1,  1));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col,  1, -1));
            tmp.push(this.getLinearPseudoLegalMoveCoords(piece.color, row, col,  1,  1));
            pseudoLegalMoveCoords = tmp.flat();
		} else if(piece.type == 'n') {
            let dirX = new Array(-2, -2, -1, -1, 1, 1, 2, 2);
            let dirY = new Array(-1, 1, -2, 2, -2, 2, -1, 1);
            for(let i = 0; i < 8; i++) {
                let x = row + dirX[i], y = col + dirY[i];
                if (this.isCellEmptyOrEnemy(x, y, piece.color)) {
                    pseudoLegalMoveCoords.push(this.num2Coord(x, y));
                }
            }
		} else if(piece.type == 'p') {
            let frontDir = (piece.color == 'wh') ? 1 : -1;
            if(this.isCellEmpty(row, col + frontDir)) {
                pseudoLegalMoveCoords.push(this.num2Coord(row, col + frontDir));
            }
            // 1 -> 1, -1 -> 6
            if(col == Math.floor((7 - frontDir * 5) / 2) && this.isCellEmpty(row, col + frontDir)) {
                if(this.isCellEmpty(row, col + frontDir * 2)) {
                    pseudoLegalMoveCoords.push(this.num2Coord(row, col + frontDir * 2));
                }
            }
            if(this.isCellEnemy(row - 1, col + frontDir, piece.color)) {
                pseudoLegalMoveCoords.push(this.num2Coord(row - 1, col + frontDir));
            }
            if(this.isCellEnemy(row + 1, col + frontDir, piece.color)) {
                pseudoLegalMoveCoords.push(this.num2Coord(row + 1, col + frontDir));
            }
            // en passant, promotion?
        }
        return pseudoLegalMoveCoords;
    }
    /**
     * Gets coordinates of legal moves.
     * Legal move: The move that the piece can do, considering the check.
     * @param  {number} row  Row of the piece.
     * @param  {number} col  Column of the piece.
     * @returns  {Array<Array<number>>}  Coordinates of pseudo legal moves of the piece.
     */
    getLegalMoveCoords(row, col) {
        let legalMoveCoords = new Array();
        let ox = row, oy = col;
        let pseudoLegalMoveCoords = this.getPseudoLegalMoveCoords(ox, oy);
        for(let plmc of pseudoLegalMoveCoords.values()) {
            let nx = plmc[0], ny = plmc[1];
            let color = this.board[ox][oy].color;
            let movingPiece = this.board[ox][oy].clone();
            let capturedPiece = this.removePiece(nx, ny);
            let piece = this.board[ox][oy];
            piece.row = nx;
            piece.col = ny;
            piece.whenMove = this.movesNumber + 1;
            this.board[nx][ny] = piece;
            this.board[ox][oy] = null;
            if(!this.isInCheck(color)) {
                legalMoveCoords.push(plmc);
            }
            this.removePiece(nx, ny);
            this.board[ox][oy] = movingPiece;
            this.board[nx][ny] = capturedPiece;
            this.pieces.push(movingPiece);
            if(capturedPiece != null) this.pieces.push(capturedPiece);
        }
        return legalMoveCoords;
    }
}

class ChessUI {
    constructor() {
        this.boardUI = document.getElementsByClassName('board')[0];
        this.boardBGUI = this.boardUI.getElementsByClassName('board-bg')[0];
        this.boardPCSUI = this.boardUI.getElementsByClassName('board-pcs')[0];
		this.boardMVSUI = this.boardUI.getElementsByClassName('board-mvs')[0];
    }
    squareNum2Coord(squareNum) {
        return new Array(parseInt(squareNum[7]), parseInt(squareNum[8]));
    }
    coord2SquareNum(coord) {
        return 'square-' + coord[0] + coord[1];
    }
    createPieceTemplate(color, type) {
        // color: 'wh', 'bl'
        // type: 'k', 'q', 'r', 'b', 'n', 'p'
        let pieceTemplate = document.createElement('div');
        pieceTemplate.classList.add('piece', color, type);
        return pieceTemplate;
    }
    createPieceUI(color, type, row, col) {
        let pieceUI = this.createPieceTemplate(color, type);
        pieceUI.classList.add('square-' + row + col);
        pieceUI.addEventListener('click', function () {
            game.onPieceClick(pieceUI.classList[3]);
        });
        this.boardPCSUI.appendChild(pieceUI);
        return pieceUI;
    }
    removePieceUI(row, col) {
        let pieceUIs = this.boardUI.getElementsByClassName('piece square-' + row + col);
        if(pieceUIs.length > 0) pieceUIs[0].remove();
    }
    movePieceUI(oldRow, oldCol, newRow, newCol) {
        let pieceUI = this.boardUI.getElementsByClassName('piece square-' + oldRow + oldCol)[0];
        this.removePieceUI(newRow, newCol);
        pieceUI.classList.remove('square-' + oldRow + oldCol);
        pieceUI.classList.add('square-' + newRow + newCol);
    }
    clearCellHighlightUIs() {
        let highlightedCells = this.boardUI.getElementsByClassName('cell cell-highlight');
        while (highlightedCells.length > 0) {
            highlightedCells[0].classList.remove('cell-highlight');
        }
    }
    createCellHighlightUI(row, col) {
        this.boardUI.getElementsByClassName('cell square-' + row + col)[0].classList.add('cell-highlight');
    }
    removeCellHighlightUI(row, col) {
        this.boardUI.getElementsByClassName('cell square-' + row + col)[0].classList.remove('cell-highlight');
    }
    clearPathUIs() {
        let moveUIs = this.boardUI.getElementsByClassName('move');
        while (moveUIs.length > 0) {
            moveUIs[0].remove();
        }
    }
    createPathUI(row, col) {
        let pathUI = document.createElement('div');
        pathUI.classList.add('move');
        if(this.boardUI.getElementsByClassName('piece square-' + row + col).length > 0) {
            pathUI.classList.add('occupied');
        } else pathUI.classList.add('empty');
        pathUI.classList.add('square-' + row + col);
        pathUI.addEventListener('click', function () {
            game.onPathClick(pathUI.classList[2]);
        });
        this.boardMVSUI.appendChild(pathUI);
    }
    clearBoardUIs() {
        let pieceUIs = this.boardUI.getElementsByClassName('piece');
        while (pieceUIs.length > 0) {
            pieceUIs[0].remove();
        }
        this.clearCellHighlightUIs();
		this.clearPathUIs();
    }
}

class Game {
    constructor() {
        this.logic = new ChessLogic();
        this.ui = new ChessUI();
        this.spCoord = null; // selectedPieceCoord
        this.turn = ''; // 'wh': white, 'bl': black
    }
    clearBoard() {
        game.logic.clearBoard();
	    game.ui.clearBoardUIs();
    }
    createPiece(color, type, row, col) {
        this.logic.createPiece(color, type, row, col);
        this.ui.createPieceUI(color, type, row, col);
    }
    movePiece(oldRow, oldCol, newRow, newCol) {
        this.logic.movePiece(oldRow, oldCol, newRow, newCol);
        this.ui.movePieceUI(oldRow, oldCol, newRow, newCol);
    }
    init() {
        this.clearBoard();
        this.createPiece('wh', 'r', 0, 0);
        this.createPiece('wh', 'n', 1, 0);
        this.createPiece('wh', 'b', 2, 0);
        this.createPiece('wh', 'q', 3, 0);
        this.createPiece('wh', 'k', 4, 0);
        this.createPiece('wh', 'b', 5, 0);
        this.createPiece('wh', 'n', 6, 0);
        this.createPiece('wh', 'r', 7, 0);
        this.createPiece('wh', 'p', 0, 1);
        this.createPiece('wh', 'p', 1, 1);
        this.createPiece('wh', 'p', 2, 1);
        this.createPiece('wh', 'p', 3, 1);
        this.createPiece('wh', 'p', 4, 1);
        this.createPiece('wh', 'p', 5, 1);
        this.createPiece('wh', 'p', 6, 1);
        this.createPiece('wh', 'p', 7, 1);
        this.createPiece('bl', 'p', 0, 6);
        this.createPiece('bl', 'p', 1, 6);
        this.createPiece('bl', 'p', 2, 6);
        this.createPiece('bl', 'p', 3, 6);
        this.createPiece('bl', 'p', 4, 6);
        this.createPiece('bl', 'p', 5, 6);
        this.createPiece('bl', 'p', 6, 6);
        this.createPiece('bl', 'p', 7, 6);
        this.createPiece('bl', 'r', 0, 7);
        this.createPiece('bl', 'n', 1, 7);
        this.createPiece('bl', 'b', 2, 7);
        this.createPiece('bl', 'q', 3, 7);
        this.createPiece('bl', 'k', 4, 7);
        this.createPiece('bl', 'b', 5, 7);
        this.createPiece('bl', 'n', 6, 7);
        this.createPiece('bl', 'r', 7, 7);
    }
    start() {
        this.init();
        this.spCoord = null;
        this.turn = 'wh';
    }
    switchTurn() {
        this.turn = (this.turn == 'wh') ? 'bl' : 'wh';
    }
    onBlankClick() {
        if (this.spCoord == null) return;
        // remove selected piece highlight
        this.ui.removeCellHighlightUI(this.spCoord[0], this.spCoord[1]);
        // clear all paths
        this.ui.clearPathUIs();
        this.spCoord = null;
    }
    onPieceClick(squareNum) {
        // handling the case of same-piece-clicking
        if (this.spCoord != null && this.ui.coord2SquareNum(this.spCoord) == squareNum) {
            this.onBlankClick();
            return;
        }
        // cancel selection
        this.onBlankClick();
        // handling the turn
        let coord = this.ui.squareNum2Coord(squareNum);
        if (!(this.turn == this.logic.board[coord[0]][coord[1]].color)) {
            return;
        }
        this.spCoord = coord;
        // create selected piece highlight
        this.ui.createCellHighlightUI(coord[0], coord[1]);
        // create paths
        let paths = this.logic.getLegalMoveCoords(coord[0], coord[1]);
        for(let path of paths.values()) {
            this.ui.createPathUI(path[0], path[1]);
        }
    }
    onPathClick(pathSquareNum) {
        let pathCoord = this.ui.squareNum2Coord(pathSquareNum);
        let spRow = this.spCoord[0], spCol = this.spCoord[1];
        let pathRow = pathCoord[0], pathCol = pathCoord[1];
        // move selected piece to path
        this.movePiece(spRow, spCol, pathRow, pathCol);
        // remove highlight
        this.ui.clearCellHighlightUIs();
        // remove paths
        this.ui.clearPathUIs();
        // create previous move highlight
        this.ui.createCellHighlightUI(spRow, spCol);
        this.ui.createCellHighlightUI(pathRow, pathCol);
        this.spCoord = null;
        this.switchTurn();
    }
}

var game = new Game();
game.start();
