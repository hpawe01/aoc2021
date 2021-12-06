const fs = require('fs')

const day = 4;

const f1 = (input, strategy) => {
  const lines = input.split("\r\n")
  const draws = lines.shift().split(',').map(v => +v)
  const boards = lines.reduce((carry, line) => {
    if (line === '') {
      carry.push({raw: [], checked: []})
    } else {
      carry[carry.length - 1].raw.push(line.match(/[0-9]+/g).map(v => +v))
    }
    return carry
  }, [])

  let nextNumber, bingoBoards = [];
  do {
    nextNumber = draws.shift();
    boards.forEach(board => markNumberInBoard(nextNumber, board))
    boards.forEach(board => {
      if (checkBoard(board)) {
        // console.log('remove board', boards.map(b => b.raw), board.checked, boards.indexOf(board))
        bingoBoards.push(...boards.splice(boards.indexOf(board), 1))
      }
    })
    // console.log(nextNumber, draws.length, boards.length, bingoBoards.length)
  } while (draws.length > 0 && boards.length > 0 && (strategy !== 'first' || bingoBoards.length < 1));
  const boardToCalc = strategy === 'first' ? bingoBoards[0] : bingoBoards[bingoBoards.length - 1]
  // console.log(boardToCalc.raw, nextNumber)
  return calcBoard(boardToCalc, nextNumber)
}

const markNumberInBoard = (num, board) => {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (!board.raw[i]) {
        board.raw[i] = []
      }
      if (!board.checked[i]) {
        board.checked[i] = []
      }
      if (board.checked[i][j] === undefined) {
        board.checked[i][j] = 0
      }
      if (board.raw[i][j] === num) {
        board.checked[i][j] = 1;
      }
    }
  }
}

const calcBoard = (board, lastNumber) => {
  let sum = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (board.checked[i][j] !== 1) {
        sum += board.raw[i][j]
      }
    }
  }
  return sum * lastNumber;
}

const checkBoard = board => {
  for (let i = 0; i < 5; i++) {
    let checkedRows = 0;
    let checkedCols = 0;
    for (let j = 0; j < 5; j++) {
      checkedRows += board.checked[i][j] || 0
      checkedCols += board.checked[j][i] || 0
    }
    if (checkedCols === 5 || checkedRows === 5) {
      return true;
    }
  }
  return false;
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

console.assert(f1(testInput, 'first') === 4512, 'part 1 fails')
console.assert(f1(testInput, 'last') === 1924, 'part 2 fails')
// console.log(f1(input))
console.log(f1(input))