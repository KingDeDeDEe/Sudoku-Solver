class Board {
  constructor(board) {

    this.board = board;
    this.solutions = 0;

    // null constructor
    if (board == undefined) {
      this.board = Array(9).fill().map(() => Array(9).fill(0));
    }
  }

  valid() {
    for (let i = 0; i < this.board.length; i++) {
      let vertical = new Set();
      let box = new Set();
      // Checks amount of inputs in vertical and box
      let x = 0;
      let y = 0;


      // Check if there are any duplicate elements in the row.
      if (((new Set(this.board[i].filter(x => x!=0))).size != this.board[i].filter(x => x!=0).length)) {
        return false;
      }

      // Check if there are any duplicate elements in the column.
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[j][i] != 0) {
          vertical.add(this.board[j][i]);
          y += 1;
        }
      }
      if (vertical.size != y) {
        return false;
      }

      // Check if there are any duplicate elements in the 9x9 box.
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          if (this.board[i%3 * 3 + j][(Math.floor(i/3) * 3) + k] != 0){
            box.add(this.board[i%3 * 3 + j][(Math.floor(i/3) * 3) + k]);
            x += 1;
          }
        }
      }
      if (box.size != x) {
        return false
      }
    }
    return true;
  }

  // Checks if the game has been won (not used for the solver but will be used in future implantation where the game will be playable)
  checkWin() {
    // Check if board is fill
    const over = this.board.some(item => item.some(x => x == 0));

    // Check if board is valid and full
    if (!over && this.valid()){
      return true;
    }  

    return false;  
  }

  // Solving sudoku puzzle using backtracking algo
  solve() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] == 0){
          for (let k = 1; k <= 9; k++){
            this.board[i][j] = k;
            if(!this.valid()){
              this.board[i][j] = 0;
            }
            else {
              // If more than one soln has been found stop the function.
              if (this.solve() == false) {
                return false;
              }
              this.board[i][j] = 0;
            }
          }
          return true;
        }
      }
    }
    // Break out of recursion if theres more than one soln
    this.solutions += 1;
    if (this.solutions > 1) {
      alert("there is more than one soln")
      return false;
    }
    this.print();
  }

  // Prints board to html.
  print() {
    let board = document.getElementById('board');
    let append = false;
    // If the board doesn't already exsist create it
    if (board == null) {
      board = document.createElement('div');
      board.id = 'board';
      // style the board
      board.style.display = 'inline-grid';
      board.style.gridTemplateColumns = "repeat(9, 25px)";
      board.style.margin = '10px';
      board.style.border = "solid #000000";
      board.style.borderWidth = "0px 2px 2px 0px";
      append = true;
    }
    else {
      board.innerHTML = "";
    }

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          let newDiv = document.createElement('INPUT');
          newDiv.className = 'box';
          newDiv.value = this.board[i][j];
          newDiv.id = 'b' + i +j;
          board.appendChild(newDiv);
          if (j%3 == 0){
            newDiv.style.borderLeft = "2px solid #000000";
          }
          if (i%3 == 0){
            newDiv.style.borderTop = "2px solid #000000";
          }
      }
    }

    if (append) {
      document.body.appendChild(board);
    }
  }
}

bo = new Board();
bo.print();

function solve() {
  // Reset board and then solve
  bo.solutions = 0;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let input = document.getElementById('b'+i+j);
      if (/^[0-9]$/.test(input.value) == false) {
        alert('Invalid inputs (accepted inputs are 0-9)\n0 represents a blank space')
        return
      }
      bo.board[i][j] = Number(input.value);
    }
  }
  console.log(bo);
  if (bo.valid() == false){
    alert("This is invalid board");
  }
  else {
    bo.solve();
  }
}
