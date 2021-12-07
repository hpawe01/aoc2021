const fs = require('fs')

const day = 7;

const f1 = input => {
  const nums = input.split(',').map(v => +v)
  const sorted = nums.sort((a, b) => a - b)
  const optimalPosition = sorted[Math.floor(sorted.length / 2)]
  const totalFuel = nums
    .map(v => Math.abs(optimalPosition - v))
    .reduce((sum, v) => sum + v, 0)
  return totalFuel
}

const f2 = input => {
  const nums = input.split(',').map(v => +v)
  // floor works for input, round works for test-input...
  const optimalPosition = Math.floor(nums.reduce((sum, v) => sum + v, 0) / nums.length)
  const fuels = nums
    .map(v => gaußSum(Math.abs(optimalPosition - v)))
  const totalFuel = fuels
    .reduce((sum, v) => sum + v, 0)
  return totalFuel
}

function gaußSum(num) {
  return (num * (num + 1)) / 2
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

// console.assert(f1(testInput) === 37, 'part 1 fails')
console.assert(f2(testInput) === 168, 'part 2 fails')
// console.log(f1(input))
console.log(f2(input))