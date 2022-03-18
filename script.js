class Piece {
    /**
     * Creates a new piece.
     * @class
     * @param  {string} color  Color of the piece. 'wh' or 'bl'.
     * @param  {string} type  Type of the piece. 'k', 'q', 'r', 'b', 'n', or 'p'.
     * @param  {number} lastMove  
     * The number of total moves on the board when the piece was moved. 0 means it hasn't moved.
     */
    constructor(color, type, lastMove = 0) {
        this.color = color;
        this.type = type;
        this.lastMove = lastMove;
    }
}

class ChessLogic {
    constructor() {
        /** @type {Array<Array<Piece>>} */
		this.board = new Array();
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
        let piece = new Piece(color, type, this.movesNumber);
        this.board[row][col] = piece;
    }
    removePiece(row, col) {
        if(this.board[row][col] != null) {
            let piece = this.board[row][col];
            this.board[row][col] = null;
            return piece;
        } else return null;
    }
    /**
     * @param  {number} oldRow  The origin row of the piece.
     * @param  {number} oldCol  The origin column of the piece.
     * @param  {number} newRow  The destination row of the piece.
     * @param  {number} newCol  The destination column of the piece.
     * @returns  {Piece}  Captured piece by the move. Could be null.
     */
    movePiece(oldRow, oldCol, newRow, newCol) {
        let capturedPiece = this.removePiece(newRow, newCol);
        let piece = this.board[oldRow][oldCol];
        this.movesNumber++;
        piece.lastMove = this.movesNumber;
        this.board[newRow][newCol] = piece;
        this.board[oldRow][oldCol] = null;
        return capturedPiece;
    }

    /**
     * Returns whether the coordinate is on the board or not.
     * @param  {number} row  Row of the coordinate.
     * @param  {number} col  Column of the coordinate.
     * @returns  {boolean}  Whether the coordinate is on the board.
     */
    isCoordValid(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    /**
     * Returns the coordinate from row number and column number.
     * @param  {number} row  Row of the coordinate.
     * @param  {number} col  Column of the coordinate.
     * @returns  {Array<number>}  The coordinate.
     */
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
    getCoords(color, type) {
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
    /**
     * Returns whether the king of a given color is in check or not.
     * @param  {string} color  Color of the king.
     * @returns  {boolean}  Whether the king is in check.
     */
    isInCheck(color) {
        let king = this.getCoords(color, 'k')[0];
		let kx = king[0], ky = king[1];
        let oppositeColor = color == 'wh' ? 'bl' : 'wh';
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
        for(let i = 1; i < 8; i++) {
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
     * Pseudo legal move is a move that the piece can do, without considering the check.
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
            const CASTLING_CODE = 10;
            if(piece.lastMove == 0 && row == 4 
                && (col == 0 && piece.color == 'wh' || col == 7 && piece.color == 'bl')
            ) {
                if(this.board[0][col] != null 
                    && this.board[0][col].type == 'r' && this.board[0][col].lastMove == 0
                ) {
                    let coord = this.num2Coord(2, col);
                    coord.push(CASTLING_CODE);
                    pseudoLegalMoveCoords.push(coord);
                }
                if(this.board[7][col] != null 
                    && this.board[7][col].type == 'r' && this.board[7][col].lastMove == 0
                ) {
                    let coord = this.num2Coord(6, col);
                    coord.push(CASTLING_CODE);
                    pseudoLegalMoveCoords.push(coord);
                }
            }
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
     * Legal move is a move that the piece can do, considering the check.
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
            let movingPiece = this.board[ox][oy];
            let capturedPiece = this.removePiece(nx, ny);
            this.board[nx][ny] = movingPiece;
            this.board[ox][oy] = null;
            if(!this.isInCheck(color)) {
                legalMoveCoords.push(plmc);
            }
            this.removePiece(nx, ny);
            this.board[ox][oy] = movingPiece;
            this.board[nx][ny] = capturedPiece;
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
    createPathUI(row, col, isSpecial = false) {
        let pathUI = document.createElement('div');
        pathUI.classList.add('move');
        if(this.boardUI.getElementsByClassName('piece square-' + row + col).length > 0) {
            pathUI.classList.add('occupied');
        } else pathUI.classList.add('empty');
        pathUI.classList.add('square-' + row + col);
        if(isSpecial) pathUI.classList.add('special');
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
            if(path.length == 2) {
                this.ui.createPathUI(path[0], path[1]);
            } else {
                this.ui.createPathUI(path[0], path[1], true);
            }
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
