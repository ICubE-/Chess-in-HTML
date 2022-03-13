class Piece {
    constructor(color, type) {
        // color: 'wh', 'bl'
        // type: 'k', 'q', 'r', 'b', 'n', 'p'
        this.color = color;
        this.type = type;
    }
}

class ChessLogic {
    constructor() {
        this.clearBoard();
    }
	clearBoard() {
        /** @type {Array<string>} */
		this.board = new Array();
        for (let i = 0; i < 8; i++) {
            let r = new Array();
            for (let j = 0; j < 8; j++) {
                r.push(null);
            }
            this.board.push(r);
        }
	}
    initBoard() {
        this.board[0][0] = new Piece('wh', 'r');
        this.board[1][0] = new Piece('wh', 'n');
        this.board[2][0] = new Piece('wh', 'b');
        this.board[3][0] = new Piece('wh', 'q');
        this.board[4][0] = new Piece('wh', 'k');
        this.board[5][0] = new Piece('wh', 'b');
        this.board[6][0] = new Piece('wh', 'n');
        this.board[7][0] = new Piece('wh', 'r');
        this.board[0][1] = new Piece('wh', 'p');
        this.board[1][1] = new Piece('wh', 'p');
        this.board[2][1] = new Piece('wh', 'p');
        this.board[3][1] = new Piece('wh', 'p');
        this.board[4][1] = new Piece('wh', 'p');
        this.board[5][1] = new Piece('wh', 'p');
        this.board[6][1] = new Piece('wh', 'p');
        this.board[7][1] = new Piece('wh', 'p');
        this.board[0][6] = new Piece('bl', 'p');
        this.board[1][6] = new Piece('bl', 'p');
        this.board[2][6] = new Piece('bl', 'p');
        this.board[3][6] = new Piece('bl', 'p');
        this.board[4][6] = new Piece('bl', 'p');
        this.board[5][6] = new Piece('bl', 'p');
        this.board[6][6] = new Piece('bl', 'p');
        this.board[7][6] = new Piece('bl', 'p');
        this.board[0][7] = new Piece('bl', 'r');
        this.board[1][7] = new Piece('bl', 'n');
        this.board[2][7] = new Piece('bl', 'b');
        this.board[3][7] = new Piece('bl', 'q');
        this.board[4][7] = new Piece('bl', 'k');
        this.board[5][7] = new Piece('bl', 'b');
        this.board[6][7] = new Piece('bl', 'n');
        this.board[7][7] = new Piece('bl', 'r');
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
                    coords.push(i.toString() + j.toString());
                }
            }
        }
        return coords;
    }
    getOppositeColor(color) {
        return color == 'wh' ? 'bl' : 'wh';
    }
    num2Coord(row, col) {
        return row.toString() + col.toString();
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
    isChecked(color) {
        // color: 'wh', 'bl'
        let king = this.getCoords(color, 'k')[0];
		let kx = parseInt(king[0]), ky = parseInt(king[1]);
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
    isCheckmated() {
        return false;
    }
    /**
     * Gets coordinates of pseudo legal moves in particular linear direction.
     * @param {string} color Color of the piece.
     * @param {number} row Row of the piece.
     * @param {number} col Column of the piece.
     * @param {number} rowdir Row direction used to search.
     * @param {number} coldir Column direction used to search.
     * @returns {Array<string>} Coordinates of pseudo legal moves in particular direction.
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
     * @param {number} row Row of the piece.
     * @param {number} col Column of the piece.
     * @returns {Array<string>} Coordinates of pseudo legal moves of the piece.
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
     * @param {string} coord Coordinate of a piece.
     * @returns {Array<string>} Coordinates of pseudo legal moves of the piece.
     */
    getLegalMoveCoords(coord) {
        let legalMoveCoords = new Array();
        let ox = parseInt(coord[0]), oy = parseInt(coord[1]);
        let pseudoLegalMoveCoords = this.getPseudoLegalMoveCoords(ox, oy);
        for(let plmc of pseudoLegalMoveCoords.values()) {
            let nx = parseInt(plmc[0]), ny = parseInt(plmc[1]);
            let color = this.board[ox][oy].color;
            let tmpPiece = this.board[nx][ny];
            this.board[nx][ny] = this.board[ox][oy];
            this.board[ox][oy] = null;
            if(!this.isChecked(color)) {
                legalMoveCoords.push(plmc);
            }
            this.board[ox][oy] = this.board[nx][ny];
            this.board[nx][ny] = tmpPiece;
        }
        return legalMoveCoords;
    }
    /**
     * @param {string} oldCoord The origin coordinate of a piece.
     * @param {string} newCoord The destination coordinate of the piece.
     */
    movePiece(oldCoord, newCoord) {
        let ox = parseInt(oldCoord[0]), oy = parseInt(oldCoord[1]);
        let nx = parseInt(newCoord[0]), ny = parseInt(newCoord[1]);
        this.board[nx][ny] = this.board[ox][oy];
        this.board[ox][oy] = null;
    }
}

class Game {
    constructor() {
        this.logic = new ChessLogic();
        this.boardUI = document.getElementsByClassName('board')[0];
        this.boardBGUI = this.boardUI.getElementsByClassName('board-bg')[0];
        this.boardPCSUI = this.boardUI.getElementsByClassName('board-pcs')[0];
		this.boardMVSUI = this.boardUI.getElementsByClassName('board-mvs')[0];
        this.wk = this.createPieceTemplate('wh', 'k');
        this.wq = this.createPieceTemplate('wh', 'q');
        this.wr = this.createPieceTemplate('wh', 'r');
        this.wb = this.createPieceTemplate('wh', 'b');
        this.wn = this.createPieceTemplate('wh', 'n');
        this.wp = this.createPieceTemplate('wh', 'p');
        this.bk = this.createPieceTemplate('bl', 'k');
        this.bq = this.createPieceTemplate('bl', 'q');
        this.br = this.createPieceTemplate('bl', 'r');
        this.bb = this.createPieceTemplate('bl', 'b');
        this.bn = this.createPieceTemplate('bl', 'n');
        this.bp = this.createPieceTemplate('bl', 'p');
        this.selectedPiece = null;
        this.turn = ''; // 'wh': white, 'bl': black
    }
    clearBoardUI() {
        this.clearCellHighlightUI();
        let pieceUIs = this.boardUI.getElementsByClassName('piece');
        while (pieceUIs.length > 0) {
            pieceUIs[0].remove();
        }
		this.clearPathUI();
    }
    createPieceTemplate(color, type) {
        // color: 'wh', 'bl'
        // type: 'k', 'q', 'r', 'b', 'n', 'p'
        let pieceTemplate = document.createElement('div');
        pieceTemplate.classList.add('piece', color, type);
        return pieceTemplate;
    }
    placePieceUI(piece, row, col) {
        let pieceUI = this.createPieceTemplate(piece.color, piece.type);
        pieceUI.classList.add('square-' + row + col);
        pieceUI.addEventListener('click', function () {
            game.onPieceClick(pieceUI.classList[3]);
        });
        this.boardPCSUI.appendChild(pieceUI);
        return pieceUI;
    }
    clearCellHighlightUI() {
        let highlightedCells = this.boardUI.getElementsByClassName('cell cell-highlight');
        while (highlightedCells.length > 0) {
            highlightedCells[0].classList.remove('cell-highlight');
        }
    }
    placePathUI(row, col) {
        let pathUI = document.createElement('div');
        pathUI.classList.add('move');
        if(this.boardUI.getElementsByClassName('piece square-' + row + col).length > 0) {
            pathUI.classList.add('occupied');
        } else pathUI.classList.add('empty');
        pathUI.classList.add('square-' + row + col);
        pathUI.addEventListener('click', function () {
            game.onPathClick(game.selectedPiece.classList[3], row, col);
        });
        this.boardMVSUI.appendChild(pathUI);
    }
    clearPathUI() {
        let moveUIs = this.boardUI.getElementsByClassName('move');
        while (moveUIs.length > 0) {
            moveUIs[0].remove();
        }
    }
    start() {
        this.clearBoardUI();
        this.logic.initBoard();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.logic.board[i][j] != null) {
                    this.placePieceUI(this.logic.board[i][j], i, j);
                }
            }
        }
        this.selectedPiece = null;
        this.turn = 'wh';
    }
    switchTurn() {
        this.turn = (this.turn == 'wh') ? 'bl' : 'wh';
    }
    onBlankClick() {
        if (this.selectedPiece == null) return;
        // remove selected piece highlight
        let squareNum = this.selectedPiece.classList[3];
        this.boardUI.getElementsByClassName('cell ' + squareNum)[0].classList.remove('cell-highlight');
        // remove paths
        this.clearPathUI();
        this.selectedPiece = null;
    }
    onPieceClick(squareNum) {
        // handling the case of same-piece-clicking
        if (this.selectedPiece != null && this.selectedPiece.classList[3] == squareNum) {
            this.onBlankClick();
            return;
        }
        // cancel selection
        this.onBlankClick();
        let clickedPiece = this.boardUI.getElementsByClassName('piece ' + squareNum)[0];
        // handling the turn
        if (!(this.turn == clickedPiece.classList[1])) {
            return;
        }
        this.selectedPiece = clickedPiece;
        // create selected piece highlight
        this.boardUI.getElementsByClassName('cell ' + squareNum)[0].classList.add('cell-highlight');
        // create paths
        let paths = this.logic.getLegalMoveCoords(squareNum.substring(7));
        for(let path of paths.values()) {
            this.placePathUI(parseInt(path[0]), parseInt(path[1]));
        }
    }
    onPathClick(oldSquareNum, newRow, newCol) {
        // move selected piece to path
        let newCoord = this.logic.num2Coord(newRow, newCol);
        let newSquareNum = 'square-' + newCoord;
        this.logic.movePiece(oldSquareNum.substring(7), newCoord);
        let capturedPieceUIArr = this.boardUI.getElementsByClassName('piece ' + newSquareNum);
        if(capturedPieceUIArr.length > 0) capturedPieceUIArr[0].remove();
        this.selectedPiece.classList.remove(oldSquareNum);
        this.selectedPiece.classList.add(newSquareNum);
        // remove highlight
        this.clearCellHighlightUI();
        // remove paths
        this.clearPathUI();
        // create previous move highlight
        this.boardUI.getElementsByClassName('cell ' + oldSquareNum)[0].classList.add('cell-highlight');
        this.boardUI.getElementsByClassName('cell ' + newSquareNum)[0].classList.add('cell-highlight');
        this.selectedPiece = null;
        this.switchTurn();
    }
}

var game = new Game();
game.start();

bclear = function() {
	game.logic.clearBoard();
	game.clearBoardUI();
}

bplace = function(color, type, row, col) {
	let pc = new Piece(color, type);
	game.logic.board[row][col] = pc;
	game.placePieceUI(pc, row, col);
}

bmove = function(ox, oy, nx, ny) {
    // move selected piece to path
    let oldCoord = game.logic.num2Coord(ox, oy);
    let newCoord = game.logic.num2Coord(nx, ny);
    game.logic.movePiece(oldCoord, newCoord);
    game.selectedPiece = game.boardUI.getElementsByClassName('piece square-' + oldCoord)[0];
    game.selectedPiece.classList.remove('square-' + oldCoord);
    game.selectedPiece.classList.add('square-' + newCoord);
    // remove selected piece highlight
    // remove paths
    game.clearPathUI();
    // create previous move highlight
    game.selectedPiece = null;
    game.switchTurn();
}