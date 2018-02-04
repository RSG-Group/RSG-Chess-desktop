import { Piece } from './pieces.js';
import * as _ from 'lodash';
import Chess_AI from './AI.js';

function Game(promoCallback) {
  this.board = [];
  this.threefold = [];
  this.turn = [];
  for (var i = 0; i < 8; i++) {
    var arrayIn = [];
    for (var j = 0; j < 8; j++) {
      arrayIn.push(null);
    }
    this.board.push(arrayIn);
  }
}

Game.prototype.piece = function (type, x, y, color) {
  var piece = Piece[type](x, y, color, this);
  this.board[y][x] = piece;
};

Game.prototype.moveSelected = function (
  selected, to, promotionCallback, checkmateCallback, playAgainstAI, simulate
) {
  var x = to.x;
  var y = to.y;

  if (selected) {
    var from = { x: selected.x, y: selected.y };

    if (this.board[y][x] != selected) {
      var validMoves = selected.getValidMoves(!simulate);
      var validMove = null;
      for (var i = 0; i < validMoves.length; i++) {
        var vm = validMoves[i];
        if (vm.x === x && vm.y === y ) {
          validMove = vm;
          break;
        }
      }

      if (!validMove) return false;

      var movePiece = validMove.movePiece;
      var take, paste, rook;
      if (movePiece) {
        take = movePiece.from;
        paste = movePiece.to;
        if (paste === null){
          this.board[take.y][take.x] = null;
        }else{
          rook = this.board[take.y][take.x];
          this.board[paste.y][paste.x] = rook;
          rook.x = paste.x;
          rook.y = paste.y;
          this.board[take.y][take.x] = null;
        }
      }
      
      var piece = this.board[y][x] ? this.board[y][x] : null;
      var movePiece = (movePiece ? validMove.movePiece : null);
      this.turn.push({
        from: from, to: to,
        color: selected.color, type: selected.type,
        piece: piece, movePiece: movePiece
      });
      
      this.board[y][x] = selected;
      this.board[selected.y][selected.x] = null;
      this.board[y][x].x = x;
      this.board[y][x].y = y;
      this.threefold.push(_.cloneDeep(game.board));
      if (selected.type === 'pawn' || piece) this.threefold = [];

      if (selected.type === "pawn") {
        if ((selected.color === "W" && y === 0) || (selected.color === "B" && y === 7)) {
          if(promotionCallback) {
            !playAgainstAI && selected.color === "B" ?
              this.promotePawn(selected, x, y, selected.color, "queen"):
              promotionCallback(selected, x, y, selected.color);
          }
        }
      };
      
      var checkmateColor = selected.color === 'W' ? 'B' : 'W';
      var checkmateValue = this.checkmate(checkmateColor);
      if(checkmateValue) checkmateCallback(checkmateValue);
      
      // Play AI
      if (playAgainstAI) {
        var bestMove = Chess_AI(this);
        this.moveSelected(
          this.board[bestMove.from.y][bestMove.from.x],
          bestMove.to,
          promotionCallback,
          checkmateCallback,
          false,
          simulate
        )
      }
      // end
    }
    selected = null;
    return true;
  }
};

Game.prototype.promotePawn = function (pawn, x, y, color, type) {
  this.piece(type, x, y, color);
};

Game.prototype.simulateAndFilter = function (moves, piece) {
  var validMoves = [], self = this, turn = self.turn, board = this.board;
  moves.forEach(function (move, i) {
    var y = move.y;
    var x = move.x;
    var from = { x: piece.x, y: piece.y };
    var movePiece = board[y][x] ? {
      piece: board[y][x],
      from: { x: x, y: y },
      to: null
    } : null;
    if(move.movePiece) movePiece = move.movePiece;

    if(movePiece) self.simpleMovePiece(movePiece.piece, movePiece.from, movePiece.to);

    self.simpleMovePiece(piece, from, { x: x, y: y });

    var warning = self.warning(piece.color);

    // Return king
    self.simpleMovePiece(piece, { x: x, y: y }, from);

    // return the movePiece with simpleMovePiece() method
    if(movePiece) self.simpleMovePiece(movePiece.piece, movePiece.to, movePiece.from);
    
    if (!warning) validMoves.push(move);
  });
  return validMoves;
}

Game.prototype.checkmate = function(color){
  for(let i = 0; i < 8; i++){
		for(let j = 0; j < 8; j++){
			if (
        game.board[i][j] &&
        game.board[i][j].color === color &&
        game.board[i][j].getValidMoves(true).length
      ) return false;
		}
  }
  
  if (this.warning(color)) return color;
	return 'D';
}

// Game.prototype.findThreefold = function(c1, c2){
  
// }

// Game.prototype.compareConfiguration = function (conf1, conf2){
//   if(!conf1 || !conf2) return false;

//   for (var i = 0; i < 8; i++){
//     for (var j = 0; j < 8; j++){
//       if ((conf1[i][j] && !conf2[i][j]) || (!conf1[i][j] && conf2[i][j])) return false;
//     }
//   }

//   return true;
// }

Game.prototype.simpleMovePiece = function(piece, from, to){
  var board = this.board;
  if(to) {
    board[to.y][to.x] = piece;
    piece.x = to.x;
    piece.y = to.y;
  }
  if(from) board[from.y][from.x] = null;
}

Game.prototype.warning = function (color) {
  var result = false;
  var king;

  this.board.forEach(function(yyy){
    yyy.forEach(function(xxx){
      if(xxx && xxx.color === color && xxx.type === "king") {
        king = xxx;
      }
    })
  })

  this.board.forEach(function(yyy){
    yyy.forEach(function(xxx){
      if(xxx && xxx.color !== color) {
        xxx.getValidMoves().forEach(function(mmm){
          if(mmm.x === king.x && mmm.y === king.y) result = true;
        })
      }
    })
  })
  return result;
};

export default Game;