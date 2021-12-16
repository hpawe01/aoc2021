const fs = require('fs')

const day = 15;

const getNeighbours = (i, j, maxI, maxJ) => {
  const neighbours = []
  if (i > 0) neighbours.push([i - 1, j])
  if (i < maxI) neighbours.push([i + 1, j])
  if (j > 0) neighbours.push([i, j - 1])
  if (j < maxJ) neighbours.push([i, j + 1])
  return neighbours.map(([i, j]) => `${i}-${j}`)
}

let steps = 1;
let chunk = 1000;
let chunkStep = 0
const doJourney = (from, dest, graph, dists) => {
  // steps++
  // if (steps > chunkStep * chunk) {
  //   console.timeEnd(`chunk-${chunk}-${chunkStep - 1}`)
  //   console.time(`chunk-${chunk}-${chunkStep++}`)
  //   console.log('doJourney', steps, from)
  // }
  graph[from].visited = true
  if (from === dest) {
    return
  }
  delete(dists[from])
  graph[from].neighbours
    .filter(neighbour => !graph[neighbour].visited)
    .forEach(neighbour => {
      const distToNextNeighbour = graph[from].totalDist + graph[neighbour].weight
      if (!graph[neighbour].totalDist || distToNextNeighbour < graph[neighbour].totalDist) {
        graph[neighbour].totalDist = distToNextNeighbour
        graph[neighbour].prev = from
        if (!dists[neighbour]) {
          dists[neighbour] = graph[neighbour]
        }
      }
    })
  steps++
  // if (steps > 10000) {
  //   console.log(steps)
  //   console.time('get next candidate')
  // }
  const sortedCandidates = Object.values(dists)
    // .filter(node => !node.visited && !!node.prev)
    .sort((a, b) => a.totalDist - b.totalDist)
  // if (steps > 10000) {
  //   console.timeEnd('get next candidate')
  // }
  if (!sortedCandidates.length) {
    console.log('No more candidates')
    return
  }

  return sortedCandidates[0].name
}

const travelGraph = (graph, grid) => {
  const start = '0-0'
  const dest = `${grid.length - 1}-${grid[0].length - 1}`
  graph[start].totalDist = 0
  let nextCandidate = start;
  let dists = {}
  do {
    nextCandidate = doJourney(nextCandidate, dest, graph, dists)
  } while (nextCandidate);
  return graph[dest].totalDist
}

const buildGraph = grid => {
  return grid.
    map((line, i) => line
      .map((v, j) => ({
          name: `${i}-${j}`,
          neighbours: getNeighbours(i, j, grid.length - 1, grid[0].length - 1),
          weight: v,
          totalDist: null,
          prev: null,
          visited: false,
        }), {})
    )
    .reduce((arr, lineArr) => {
      arr.push(...lineArr)
      return arr
    }, [])
    .reduce((obj, node) => {
      obj[node.name] = node;
      return obj
    }, {})
}

const f1 = input => {
  const grid = input.split("\r\n")
    .map(line => line.split('').map(v => +v))
  const graph = buildGraph(grid)

  return travelGraph(graph, grid)
}

const increaseGrid = (grid, by) => {
  const increasedGrid = []
  for (let chunkRow = 0; chunkRow < by; chunkRow++) {
    for (let chunkCol = 0; chunkCol < by; chunkCol++) {
      const amountToAdd = chunkRow + chunkCol
      for (i = 0; i < grid.length; i++) {
        if (chunkCol === 0) increasedGrid[chunkRow * grid.length + i] = []
        for (j = 0; j < grid[0].length; j++) {
          let val = grid[i][j] + amountToAdd
          if (val > 9) {
            val -= 9
          }
          increasedGrid[chunkRow * grid.length + i][chunkCol * grid[0].length + j] = val
        }
      }
    }
  }
  return increasedGrid
}

const f2 = input => {
  const grid = input.split("\r\n")
    .map(line => line.split('').map(v => +v))
  const increasedGrid = increaseGrid(grid, 5)
  const graph = buildGraph(increasedGrid)

  const result = travelGraph(graph, increasedGrid)
  return result
}

const printGrid = grid => {
  console.log(grid.map(l => l.join('')).join("\n"))
}

const size = grid => [grid.length, grid[0].length]

// const printPath = (start, dest, graph) => {
//   const path = [];
//   let current = dest
//   do {
//     current = graph[current].prev
//     path.push(current)
//   } while (current !== start)
//   console.log(path.join(' < '), path.reduce((sum, node) => sum + graph[node].weight, 0))
// }

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

// console.assert(f1(testInput) === 40, 'part 1 fails')
// console.assert(f2(testInput) === 315, 'part 2 fails')
// console.log(f1(input))
console.log(f2(input))