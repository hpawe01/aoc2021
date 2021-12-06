const fs = require('fs')

const day = 5;

const f1 = (input, skipDiagonals) => {
  const lines = input.split("\r\n").map(l => {
    const points = l.split(' -> ')
    return {
      from: points[0].split(',').map(v => +v),
      to: points[1].split(',').map(v => +v)
    }
  })
  // console.log(lines)
  const drawLine = ({from, to}, screen) => {
    // console.log(screen)
    const [x1, x2] = [from[0], to[0]]
    const [y1, y2] = [from[1], to[1]]
    if (x1 === x2) {
      const from = Math.min(y1, y2)
      const to = Math.max(y1, y2)
      for (let i = from; i <= to; i++) {
        if (!screen[x1]) {
          screen[x1] = []
        }
        if (!screen[x1][i]) {
          screen[x1][i] = 1
        } else {
          if (screen[x1][i] === 1) {
            numOfIntersections++
          }
          screen[x1][i]++
        }
      }
    } else if (y1 === y2) {
      const from = Math.min(x1, x2)
      const to = Math.max(x1, x2)
      for (let i = from; i <= to; i++) {
        if (!screen[i]) {
          screen[i] = []
        }
        if (!screen[i][y1]) {
          screen[i][y1] = 1
        } else {
          if (screen[i][y1] === 1) {
            numOfIntersections++
          }
          screen[i][y1]++
        }
      }
    } else if (!skipDiagonals && Math.abs(y1 - y2) === Math.abs(x1 - x2)) {
      const m = (y1 - y2) / (x1 - x2)
      const t = y1 - m * x1
      const from = Math.min(x1, x2)
      const to = Math.max(x1, x2)
      for (let x = from; x <= to; x++) {
        const y = m * x + t
        if (!screen[x]) {
          screen[x] = []
        }
        if (!screen[x][y]) {
          screen[x][y] = 1
        } else {
          if (screen[x][y] === 1) {
            numOfIntersections++
          }
          screen[x][y]++
        }
      }

    }
  }
  const screen = [];
  let numOfIntersections = 0;
  lines.forEach(line => drawLine(line, screen))
  // console.log(numOfIntersections)
  return numOfIntersections
}


const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

// console.assert(f1(testInput, true) === 5, 'part 1 fails')
// console.assert(f1(testInput) === 12, 'part 2 fails')
// console.log(f1(input, true))
console.log(f1(input))