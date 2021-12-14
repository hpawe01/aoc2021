const fs = require('fs')

const day = 12;

const move = (to, graph, breadcrumbs, paths, validLinksFn) => {
  breadcrumbs.push(to.name)
  if (to.name === 'end') {
    paths.push(breadcrumbs)
    return
  }
  let hasSomeSmallNodeTwice = breadcrumbs
    .filter(str => !graph[str].big)
    .reduce((bool, str, i, arr) => bool || arr.indexOf(str) !== i, false)
  doJourney(to, graph, breadcrumbs, paths, validLinksFn, hasSomeSmallNodeTwice)
}

const doJourney = (from, graph, breadcrumbs, paths, validLinksFn, hasSomeSmallNodeTwice) => {
  const validLinks = from.to.filter(nodeName => validLinksFn(nodeName, graph, breadcrumbs, hasSomeSmallNodeTwice))
  validLinks.forEach(nodeName => move(graph[nodeName], graph, [...breadcrumbs], paths, validLinksFn))
}

const buildGraph = input => {
  const connections = input.split("\r\n").map(s => s.split('-'))
  const graph = connections.reduce((graph, [from, to]) => {
    graph[from] = graph[from] || {name: from, big: from === from.toUpperCase(), to: []}
    graph[from].to.push(to)
    graph[to] = graph[to] || {name: to, big: to === to.toUpperCase(), to: []}
    graph[to].to.push(from)
    return graph
  }, {})
  return graph
}

const f1 = input => {
  const graph = buildGraph(input)
  const paths = []
  const journeyValidationFn = (nodeName, graph, breadcrumbs) =>
    nodeName !== 'start' && (graph[nodeName].big || !breadcrumbs.includes(nodeName))
  doJourney(graph.start, graph, ['start'], paths, journeyValidationFn)
  return paths.length
}

const f2 = input => {
  const graph = buildGraph(input)
  const paths = []
  const journeyValidationFn = (nodeName, graph, breadcrumbs, hasSomeSmallNodeTwice) => {
    if (nodeName === 'start') return false
    if (graph[nodeName].big) return true
    if (hasSomeSmallNodeTwice) return !breadcrumbs.includes(nodeName)
    return breadcrumbs.filter(breadcrumb => breadcrumb === nodeName).length < 2
  }
  doJourney(graph.start, graph, ['start'], paths, journeyValidationFn)
  return paths.length
}

const testInput1 = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const testInput2 = fs.readFileSync(`./${day}-test-input-2.txt`, 'utf8')
const testInput3 = fs.readFileSync(`./${day}-test-input-3.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

console.assert(f1(testInput1) === 10, 'part 1.1 fails')
console.assert(f1(testInput2) === 19, 'part 1.2 fails')
console.assert(f1(testInput3) === 226, 'part 1.3 fails')
console.assert(f2(testInput1) === 36, 'part 1.1 fails')
console.assert(f2(testInput2) === 103, 'part 1.2 fails')
console.assert(f2(testInput3) === 3509, 'part 1.3 fails')
// console.log(f1(input))
console.log(f2(input))