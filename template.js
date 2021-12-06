const fs = require('fs')

const day = 0;

const f1 = input => {
  const lines = input.split("\r\n")
  return false
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

console.assert(f1(testInput) === 0, 'part 1 fails')
// console.assert(f2(testInput) === 0, 'part 2 fails')
// console.log(f1(input))
// console.log(f2(input))