const fs = require('fs')

const day = 3;

const f1 = input => {
  const lines = input.split("\r\n")
  const nums = lines.map(line => line.split('').map(char => +char))
  const aggArray = nums
    .reduce((arr, cur) => {
      if (!arr) {
        return cur;
      }
      return arr.map((a, i) => a + cur[i])
    })

  const gammaStr = aggArray.reduce((str, num) => str + +(num >= lines.length / 2), '')
  const gamma = parseInt(gammaStr, 2)
  const epsilon = (~gamma >>> 0) & (Math.pow(2, gammaStr.length) - 1)

  return gamma * epsilon
}

const f2 = input => {
  const lines = input.split("\r\n")
  const nums = lines.map(line => line.split('').map(char => +char))

  const filterBins = (rest, most, pointer) => {
    if (rest.length === 1) {
      return rest[0]
    }
    const mostCommonBitOnPosition = getMostCommonBitOnPosition(rest, pointer)
    const filterBy = most ? mostCommonBitOnPosition : ~mostCommonBitOnPosition & 1
    const newRest = rest.filter(arr => arr[pointer] === filterBy)
    return filterBins(newRest, most, pointer + 1)
  }

  const getMostCommonBitOnPosition = (nums, pointer) => {
    return +(nums.reduce((sum, arr) => sum + arr[pointer], 0) >= nums.length / 2)
  }

  const oxygenGeneratorRatingStr = filterBins(nums, true, 0).join('')
  const oxygenGeneratorRating = parseInt(oxygenGeneratorRatingStr, 2)

  const co2scrubberRatingStr = filterBins(nums, false, 0).join('')
  const co2scrubberRating = parseInt(co2scrubberRatingStr, 2)

  return oxygenGeneratorRating * co2scrubberRating
}
const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

console.assert(f1(testInput) === 198, 'part 1 fails')
console.assert(f2(testInput) === 230, 'part 2 fails')
console.log(f1(input))
console.log(f2(input))