const fs = require('fs')

const d1fn1 = (input, window) => {
  window = window || 1
  const lines = input.split("\r\n")
  const numbers = lines.map(line => +line)
  const measurements = numbers.reduce((counts, index, numbers) => {
    if (index >= window) {
      const prevGroup = numbers.slice(index - window, index).reduce((sum, num) => sum + num, 0)
      const currentGroup = numbers.slice(index + 1 - window, index + 1).reduce((sum, num) => sum + num, 0)

      if (prevGroup > currentGroup) {
        counts.decreased++;
      }
      if (prevGroup < currentGroup) {
        counts.increased++;
      }
    }
    return counts;
  }, {
    increased: 0,
    decreased: 0,
  })
  return measurements.increased
}

const testInput = fs.readFileSync('./1-test-input.txt', 'utf8')
const input = fs.readFileSync('./1-input.txt', 'utf8')

console.assert(d1fn1(testInput) === 7, 'part 1 fails')
console.assert(d1fn1(testInput, 3) === 5, 'part 2 fails')
console.log(d1fn1(input))
console.log(d1fn1(input, 3))