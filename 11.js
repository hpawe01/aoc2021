const fs = require('fs')

const day = 11;

let loggingEnabled = false;

let currentCursor = 0;

const flash = (i, j, grid, flashes) => {
  flashes.push(`${i},${j}`)
  const neighbours = getNeighbours(grid, i, j)
  if (loggingEnabled) {
    process.stdout.write(`> flash at ${i} ${j} (${grid[i][j]}) with neighbours ${neighbours.map(n => n.join()).join(';')}\n`)
  }
  neighbours.forEach(([k, l]) => {
    grid[k][l]++
    if (grid[k][l] > 9 && !flashes.includes(`${k},${l}`)) {
      // process.stdout.cursorTo(++currentCursor)
      flash(k, l, grid, flashes)
      // currentCursor--
    }
  })
}

const getNeighbours = (grid, i, j) => {
  const neighbours = []
  if (i > 0 && j > 0) neighbours.push([i - 1, j - 1])
  if (i > 0) neighbours.push([i - 1, j])
  if (i > 0 && j < grid[0].length - 1) neighbours.push([i - 1, j + 1])
  if (i < grid.length - 1 && j > 0) neighbours.push([i + 1, j - 1])
  if (i < grid.length - 1) neighbours.push([i + 1, j])
  if (i < grid.length - 1 && j < grid[0].length - 1) neighbours.push([i + 1, j + 1])
  if (j > 0) neighbours.push([i, j - 1])
  if (j < grid[0].length - 1) neighbours.push([i, j + 1])
  // process.stdout.write(`==> neighbours for ${i}, ${j}: ${neighbours.join()}\n`)
  return neighbours
}

const step = grid => {
  const flashes = [];
  // inc by 1
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j]++
    }
  }

  // flash if === 10
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (loggingEnabled) {
        process.stdout.write(`Check ${[i,j].join()} (${grid[i][j]})\n`)
      }
      if (grid[i][j] > 9 && !flashes.includes(`${i},${j}`)) {
        flash(i, j, grid, flashes)
      }
    }
  }

  // set all > 9 to 0
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] > 9) {
        grid[i][j] = 0;
      }
    }
  }
  return flashes.length
}

const getNumberOfFlashes = (remaining, sum, grid) => {
  // process.stdout.write(`Remaining: ${remaining}, current sum: ${sum}\n`)
  // process.stdout.write(`${grid.map(line => line.join('')).join("\n")}\n=============\n`)
  // loggingEnabled = true;
  if (remaining === 0) {
    return sum;
  }
  const numberOfFlashes = step(grid);
  if (loggingEnabled) {
    loggingEnabled = false;
  }
  return getNumberOfFlashes(remaining - 1, sum + numberOfFlashes, grid);
}

const f1 = input => {
  const grid = input.split("\r\n")
    .map(line => line.split('').map(v => +v))

  const numberOfFlashes = getNumberOfFlashes(100, 0, grid)
  return numberOfFlashes
}

const f2 = input => {
  const grid = input.split("\r\n")
    .map(line => line.split('').map(v => +v))

  let currentStep = 0;
  const numberOfOctopuses = grid.length * grid[0].length;

  let numberOfFlashes = 0;

  do {
    numberOfFlashes = step(grid);
    currentStep++
  } while (numberOfFlashes < numberOfOctopuses || currentStep > 1000);

  return currentStep
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

// console.assert(f1(testInput) === 1656, 'part 1 fails')
console.assert(f2(testInput) === 195, 'part 2 fails')
// console.log(f1(input))
console.log(f2(input))