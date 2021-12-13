const fs = require('fs')

const day = 9;

const f1 = input => {
  const grid = input
    .split("\r\n")
    .map(line => line.split('').map(v => +v))

  let riskLevel = 0;

  const getNeighbours = (grid, i, j) => {
    const neighbours = []
    if (i > 0) neighbours.push(grid[i - 1][j])
    if (i < grid.length - 1) neighbours.push(grid[i + 1][j])
    if (j > 0) neighbours.push(grid[i][j - 1])
    if (j < grid[0].length - 1) neighbours.push(grid[i][j + 1])
    return neighbours
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const neighbours = getNeighbours(grid, i, j);
      if (Math.min(...neighbours) <= grid[i][j]) {
        continue
      }
      riskLevel += grid[i][j] + 1
    }
  }
  return riskLevel
}

const f2 = input => {
  const grid = input
    .split("\r\n")
    .map(line => line.split('').map(v => +v))

  let basins = [];

  const getNeighbours = (grid, i, j) => {
    const neighbours = []
    if (i > 0) neighbours.push([grid[i - 1][j], i - 1, j])
    if (i < grid.length - 1) neighbours.push([grid[i + 1][j], i + 1, j])
    if (j > 0) neighbours.push([grid[i][j - 1], i, j - 1])
    if (j < grid[0].length - 1) neighbours.push([grid[i][j + 1], i, j + 1])
    return neighbours
  }
  const setBasin = (grid, i, j) => {
    if (grid[i][j] === 9 || grid[i][j].toString().startsWith('b')) {
      return
    }
    const neighbours = getNeighbours(grid, i, j);
    let basinIndex = neighbours.map(neighbour => neighbour[0]).filter(n => n.toString().startsWith('b'))[0]
    if (!basinIndex) {
      basinIndex = `b${Object.keys(basins).length}`
      basins[basinIndex] = 1
    } else {
      basins[basinIndex]++
    }
    grid[i][j] = basinIndex
    neighbours.forEach(([_, k, l]) => setBasin(grid, k, l))
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      setBasin(grid, i, j)
    }
  }
  const basinSizes = Object.values(basins)
  return basinSizes.sort((a, b) => b - a).slice(0, 3).reduce((prod, basin) => prod * basin, 1)
}



const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

// console.assert(f1(testInput) === 15, 'part 1 fails')
console.assert(f2(testInput) === 1134, 'part 2 fails')
// console.log(f1(input))
console.log(f2(input))