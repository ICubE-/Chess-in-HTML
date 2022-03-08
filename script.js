class Piece {
    constructor(color, type) {
        // color: 'wh', 'bl'
        // type: 'k', 'q', 'r', 'b', 'n', 'p'
        this.color = color;
        this.type = type;
    }
}

class Coord {
    constructor(row, col) {
        this.row = this.x = row;
        this.col = this.y = col;
    }
}

class ChessLogic {
    constructor() {
        this.clearBoard();
    }
	clearBoard() {
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
                    coords.push(new Coord(i, j));
                }
            }
        }
        return coords;
    }
    /*getThreateningCells(coord) {
		let threateningCells = new Array();
		let pc = this.board[coord[0], coord[1]];
		if(pc == null) return threateningCells;
		else if(pc.type == 'k') {
			
		}
		
	}*/
    isChecked(color) {
        // color: 'wh', 'bl'
        let king = this.getCoords(color, 'k')[0];
        let opposite = color == 'wh' ? 'bl' : 'wh';
        // check king
        for (let i = king.x - 1; i <= king.x + 1; i++) {
            for (let j = king.y - 1; j <= king.y + 1; j++) {
                if (this.isCoordValid(i, j) && this.board[i][j] != null) {
                    let pc = this.board[i][j];
                    if (pc.color == opposite && pc.type == 'k') {
                        return true;
                    }
                }
            }
        }
        // check horizontal, vertical
        for (let i = king.x - 1; i >= 0; i--) {
			if(this.board[i][king.y] != null) {
				let pc = this.board[i][king.y];
				if(pc.color == opposite && (pc.type == 'q' || pc.type == 'r')) {
				   return true;
				}
				break;
			}
		}
		for (let i = king.x + 1; i < 8; i++) {
			if(this.board[i][king.y] != null) {
				let pc = this.board[i][king.y];
				if(pc.color == opposite && (pc.type == 'q' || pc.type == 'r')) {
				   return true;
				}
				break;
			}
		}
		for (let j = king.y - 1; j >= 0; j--) {
			if(this.board[king.x][j] != null) {
				let pc = this.board[king.x][j];
				if(pc.color == opposite && (pc.type == 'q' || pc.type == 'r')) {
				   return true;
				}
				break;
			}
		}
		for (let j = king.y + 1; j < 8; j++) {
			if(this.board[king.x][j] != null) {
				let pc = this.board[king.x][j];
				if(pc.color == opposite && (pc.type == 'q' || pc.type == 'r')) {
				   return true;
				}
				break;
			}
		}
		// check diagonal
		for (let i = 1; i < 7; i++) {
			if(!this.isCoordValid(king.x - i, king.y - i)) {
				break;
			}
			let pc = this.board[king.x - i][king.y - i];
			if(pc != null) {
				if(pc.color == opposite && (pc.type == 'q' || pc.type == 'b')) {
				   return true;
				}
				break;
			}
		}
		for (let i = 1; i < 7; i++) {
			if(!this.isCoordValid(king.x - i, king.y + i)) {
				break;
			}
			let pc = this.board[king.x - i][king.y + i];
			if(pc != null) {
				if(pc.color == opposite && (pc.type == 'q' || pc.type == 'b')) {
				   return true;
				}
				break;
			}
		}
		for (let i = 1; i < 7; i++) {
			if(!this.isCoordValid(king.x + i, king.y - i)) {
				break;
			}
			let pc = this.board[king.x + i][king.y - i];
			if(pc != null) {
				if(pc.color == opposite && (pc.type == 'q' || pc.type == 'b')) {
				   return true;
				}
				break;
			}
		}
		for (let i = 1; i < 7; i++) {
			if(!this.isCoordValid(king.x + i, king.y + i)) {
				break;
			}
			let pc = this.board[king.x + i][king.y + i];
			if(pc != null) {
				if(pc.color == opposite && (pc.type == 'q' || pc.type == 'b')) {
				   return true;
				}
				break;
			}
		}
		// check knight
		let knightX = new Array(-2, -2, -1, -1, 1, 1, 2, 2);
		let knightY = new Array(-1, 1, -2, 2, -2, 2, -1, 1);
		for(let i = 0; i < 8; i++) {
			let x = king.x + knightX[i], y = king.y + knightY[i];
			if (this.isCoordValid(x, y) && this.board[x][y] != null) {
				let pc = this.board[x][y];
				if (pc.color == opposite && pc.type == 'n') {
					return true;
				}
			}
		}
		// check pawn
		let frontDir, px, py;
		if(color == 'wh') py = king.y + 1;
		else py = king.y - 1;
		px = king.x - 1;
		if (this.isCoordValid(px, py) && this.board[px][py] != null) {
			let pc = this.board[px][py];
			if (pc.color == opposite && pc.type == 'p') {
				return true;
			}
		}
		px = king.x + 1;
		if (this.isCoordValid(px, py) && this.board[px][py] != null) {
			let pc = this.board[px][py];
			if (pc.color == opposite && pc.type == 'p') {
				return true;
			}
		}

        return false;
    }
    isCheckMated() {
        return false;
    }
	getPseudoLegalMoves(coord) {}
    getLegalMoves(coord) {}
	move() {}
}

class Game {
    constructor() {
        this.logic = new ChessLogic();
        this.boardUI = document.getElementsByClassName('board')[0];
        this.boardBGUI = this.boardUI.getElementsByClassName('board-bg')[0];
        this.boardPCSUI = this.boardUI.getElementsByClassName('board-pcs')[0];
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
        let highlightedCells = this.boardUI.getElementsByClassName('cell cell-highlight');
        while (highlightedCells.length > 0) {
            highlightedCells[0].classList.remove('cell-highlight');
        }
        let pieceUIs = this.boardUI.getElementsByClassName('piece');
        while (pieceUIs.length > 0) {
            pieceUIs[0].remove();
        }
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
        this.selectedPiecet = null;
        this.turn = 'wh';
    }
    onBlankClick() {
        if (this.selectedPiece == null) return;
        // remove selected piece highlight
        let squareNum = this.selectedPiece.classList[3];
        let hCell = this.boardUI.getElementsByClassName('cell ' + squareNum)[0];
        hCell.classList.remove('cell-highlight');
        // remove paths (WIP)
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
        let hCell = this.boardUI.getElementsByClassName('cell ' + squareNum)[0];
        hCell.classList.add('cell-highlight');
        // create paths
        this.logic.getMovableCells(squareNum[7] + squareNum[8]);
        // ....wip
    }
    onPathClick() {
        // move selected piece to path
        // remove selected piece highlight
        // remove paths
        // create previous move highlight
        this.selectedPiece = null;
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