const fs = require('fs')

const day = 6;

const f1 = (input, days) => {
  let lanterns = input.split(",").map(v => +v).reduce((ecosystem, lantern) => {
    ecosystem[lantern] = ecosystem[lantern] || 0
    ecosystem[lantern]++
    return ecosystem
  }, {})
  for (let i = 0; i < 9; i++) {
    lanterns[i] = lanterns[i] || 0;
  }
  const numOfLanterns = lanterns => Object.values(lanterns).reduce((sum, num) => sum + num, 0)
  let step = 1;
  do {
    lanterns = newDay(lanterns)
  } while (step++ < days);
  return numOfLanterns(lanterns)
}

const newDay = lanterns => {
  return {
    0: lanterns[1],
    1: lanterns[2],
    2: lanterns[3],
    3: lanterns[4],
    4: lanterns[5],
    5: lanterns[6],
    6: lanterns[7] + lanterns[0],
    7: lanterns[8],
    8: lanterns[0],
  }
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

console.assert(f1(testInput, 80) === 5934, 'part 1 fails')
console.assert(f1(testInput, 256) === 26984457539, 'part 2 fails')

console.log(f1(input, 80))
console.log(f1(input, 256))
