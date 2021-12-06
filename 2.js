const fs = require('fs')

const d2f1 = input => {
  const lines = input.split("\r\n")
  const instructions = lines.map(line => {
    const [op, val] = line.split(' ')
    return {op, val: +val}
  })
  const finalPosition = instructions.reduce((position, instruction) => {
    switch (instruction.op) {
      case 'forward':
        position.x += instruction.val
        break;

      case 'down':
        position.z += instruction.val
        break;

      case 'up':
        position.z -= instruction.val
        break;

      default:
        break;
    }
    return position
  }, {x: 0, z: 0})
  return finalPosition.x * finalPosition.z;
}

const d2f2 = input => {
  const lines = input.split("\r\n")
  const instructions = lines.map(line => {
    const [op, val] = line.split(' ')
    return {op, val: +val}
  })
  const finalPosition = instructions.reduce((position, instruction) => {
    switch (instruction.op) {
      case 'forward':
        position.horizontal += instruction.val
        position.depth += position.aim * instruction.val
        break;

      case 'down':
        position.aim += instruction.val
        break;

      case 'up':
        position.aim -= instruction.val
        break;

      default:
        break;
    }
    return position
  }, {horizontal: 0, depth: 0, aim: 0})

  return finalPosition.horizontal * finalPosition.depth;
}

const testInput = fs.readFileSync('./2-test-input.txt', 'utf8')
const input = fs.readFileSync('./2-input.txt', 'utf8')

console.assert(d2f1(testInput) === 150, 'part 1 fails')
console.assert(d2f2(testInput) === 900, 'part 2 fails')
// console.log(d2f1(input))
console.log(d2f2(input))