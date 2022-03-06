class Piece {
    constructor(color, type) {
        // color: "wh", "bl"
        // type: "k", "q", "r", "b", "n", "p"
        this.color = color;
        this.type = type;
    }
}

class ChessLogic {
    constructor() {
		// making clear board
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
}

class Game {
    constructor() {
        this.logic = new ChessLogic();
		this.boardUI = document.getElementsByClassName('board')[0];
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
    }
	clearBoardUI() {
		let pieceUIs = this.boardUI.getElementsByClassName('piece');
		while(pieceUIs.length > 0) {
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
		pieceUI.addEventListener(
			'click', 
			function(){ game.onPieceClick(pieceUI.classList[3]); }
		);
		this.boardUI.appendChild(pieceUI);
		return pieceUI;
	}
	start() {
		this.clearBoardUI();
		this.logic.initBoard();	
		for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(this.logic.board[i][j] != null) {
					this.placePieceUI(this.logic.board[i][j], i, j);
				}
            }
        }
	}
    onBlankClick() {
		// remove selected piece highlight
		// remove paths
		this.selectedPiece.classList.remove('hhhhh');
		this.selectedPiece = null;
	}
	onPieceClick(squareNum) {/*
		if(this.selectedPiece == null)
		if(this.selectedPiece.classList[3] == squareNum) {
			this.onBlankClick();
		} else {
			this.selectedPiece = this.boardUI.getElementsByClassName('piece ' + squareNum)[0];
			this.selectedPiece.classList.add('hhhhh');
			// create selected piece highlight
			// create paths
		}*/
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
