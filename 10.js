const fs = require('fs')

const day = 10;

const scores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}
const autoCompleteScores = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

const pairs = [
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
]

const findFirstIllegalChar = line => {
  const stack = []
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const pair = pairs.find(pair => pair.includes(char))
    if (char === pair[0]) {
      stack.push(pair[0])
    } else {
      const lastOpeningChar = stack.pop()
      if (lastOpeningChar !== pair[0]) {
        return pair[1]
      }
    }
  }
}

const f1 = input => {
  const lines = input.split("\r\n")
  const illegalChars = lines
    .map(line => findFirstIllegalChar(line))
    .filter(char => !!char)
  return illegalChars.reduce((sum, char) => sum + +scores[char], 0)
}

const getClosingChar = char => {
  return pairs.find(pair => pair[0] === char)[1]
}

const findAutocompleteSequence = line => {
  const stack = []
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const pair = pairs.find(pair => pair.includes(char))
    if (char === pair[0]) {
      stack.push(pair[0])
    } else {
      stack.pop()
    }
  }
  if (!stack.length) {
    return stack
  }
  return stack.reduce((arr, openingChar) => [getClosingChar(openingChar), ...arr], [])
}


const f2 = input => {
  const lines = input.split("\r\n")
  const scores = lines
    .filter(line => !findFirstIllegalChar(line))
    .map(line => findAutocompleteSequence(line))
    .map(sequence => sequence.reduce((sum, char) => sum * 5 +autoCompleteScores[char], 0))
    .sort((a, b) => a - b)
  return scores[(scores.length - 1) / 2]
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

console.assert(f1(testInput) === 26397, 'part 1 fails')
console.assert(f2(testInput) === 288957, 'part 2 fails')
// console.log(f1(input))
console.log(f2(input))