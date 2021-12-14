const fs = require('fs')
const math = require('mathjs')

const day = 13;

const flip = grid => {
  const flippedGrid = math.matrix()
  grid.forEach((val, [y, x]) => {
    flippedGrid.set([(grid.size()[0] - 1) - y, x], val)
  }, true)
  return flippedGrid
}

const fold = (grid, [direction, where]) => {
  if (direction !== 'y') {
    grid = math.transpose(grid)
  }
  const upperHalf = grid.subset(math.index(math.range(0, where), math.range(0, grid.size()[1])))
  const lowerHalf = grid.subset(math.index(math.range(where + 1, grid.size()[0]), math.range(0, grid.size()[1])))
  const flippedLowerHalf = flip(lowerHalf)
  const foldedGrid = math.add(upperHalf, flippedLowerHalf).map(val => val > 0 ? 1 : 0)
  if (direction !== 'y') {
    return math.transpose(foldedGrid)
  }
  return foldedGrid
}

const print = grid => {
  console.log(grid.toArray().map(l => l.map(v => v > 0 ? '#' : '.').join('')).join(`\n`))
}

const f1 = input => {
  const [rawPoints, rawInstructions] = input.split("\r\n\r\n")
  const instructions = rawInstructions.split("\r\n").map(l => l.split(' ')[2].split('=')).map(([inst, v]) => [inst, +v])
  const points = rawPoints.split("\r\n").map(line => line.split(',').map(v => +v))

  const height = instructions.find(inst => inst[0] === 'y')[1] * 2 + 1
  const width = instructions.find(inst => inst[0] === 'x')[1] * 2 + 1
  const grid = math.zeros(height, width)

  points.forEach(([y, x])=> {
    grid.set([x,y], 1)
  })

  let foldedGrid = grid
  instructions.forEach(instruction => foldedGrid = fold(foldedGrid, instruction))
  print(foldedGrid)
  return math.sum(foldedGrid)
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

// console.assert(f1(testInput) === 17, 'part 1 fails')
// console.assert(f2(testInput) === 0, 'part 2 fails')
console.log(f1(input))
// console.log(f2(input))