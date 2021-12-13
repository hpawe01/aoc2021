const fs = require('fs')

const day = 8;


const allDigits = {
  '012456': 0, //6
  '25': 1, //2
  '02346': 2, //5
  '02356': 3, //5
  '1235': 4, //4
  '01356': 5, //5
  '013456': 6, //6
  '025': 7, //3
  '0123456': 8, //7
  '012356': 9, //6
}

const f2 = input => {
  const lines = input.split("\r\n")
  const entries = lines.map(line => {
    const [input, output] = line.split(' | ')
    return {
      input: input.split(' '),
      output: output.split(' ')
    }
  })
  correctNumbers = entries.map(entry => {
    const signalMapping = getSignalMapping([...entry.input, ...entry.output])
    const number = getNumbers(entry.output, signalMapping)
    return number
  });
  return correctNumbers.reduce((sum, num) => {
    return sum + num
  }, 0)
}

const getSignalMapping = examples => {
  // console.log('getSignalMapping', examples);

  const notInAll = arr => {
    const group = arr.reduce((carry, str) => {
      str.split('').forEach(char => carry[char] = (carry[char] || 0) + 1)
      return carry
    },{})
    return Object.keys(group).filter(key => group[key] < arr.length)
  }

  // return chars that are in str1 but not in str2
  const diff = (str1, str2) => {
    return str1
      .split('')
      .filter(c => !str2.includes(c))
      .join('')
  }

  const unique = Object.keys(examples
    .map(example => example.split('').sort().join(''))
    .reduce((obj, example) => {
      obj[example] = 1
      return obj
    }, {})
  )
    .sort((a, b) => a.length - b.length)
    .reduce((c, v) => {c[v.length] = c[v.length] || []; c[v.length].push(v); return c}, {})
  const wireA = notInAll([unique['2'][0], unique['3'][0]])[0]
  const wireE = diff(notInAll(unique['6']).join(''), unique['4'][0])

  const n35 = notInAll(unique['5'].filter(str => !str.includes(wireE)))
  const wireB = n35.filter(c => !unique['2'][0].includes(c)).join('')
  const wireC = unique['2'][0].split('').filter(c => n35.includes(c)).join('')
  const wireF = unique['2'][0].split('').filter(c => c !== wireC).join('')
  const wireD = unique['4'][0].split('').filter(c => ![wireB, wireC, wireF].includes(c)).join('')
  const wireG = unique['7'][0].split('').filter(c => ![wireA, wireB, wireC, wireD, wireE, wireF].includes(c)).join('')
  // console.log({
  //   numberOfExamples: examples.length,
  //   unique,
  //   wireA,
  //   wireB,
  //   wireC,
  //   wireD,
  //   wireE,
  //   wireF,
  //   wireG
  // })
  // a = char that is missing in 2'[1] comparing to 3'[7] ==> d
  // e = the char of char differences of 6'[0,6,9] that is not in 4'[4] ==> g
  // 2 = all 5' where e is set

  // b = the char of char differences of (all 5' where e is not set [3,5]) that is not in 2'[1]
    // => e,a ==> e


  // c = the char of char differences of (all 5' where e is not set [3,5]) that is in 2'[1]
  // => a
  // f = the char of 2'[1] that is not c => b
  // d = the char of 4'[4] that is not in (b, c, f)
  // g = rest


  // return ['d', 'e', 'a', 'f', 'g', 'b', 'c']
  return [ wireA,
    wireB,
    wireC,
    wireD,
    wireE,
    wireF,
    wireG]
}

const getNumbers = (outputs, signalMapping) => {
  const digits = outputs.map(output => {
    const correctSegmentNumbers = output.split('').map(char => signalMapping.indexOf(char)).sort((a, b) => a - b).join('')
    // console.log(output, signalMapping, correctSegmentNumbers)
    return allDigits[correctSegmentNumbers];
  })
  // console.log(digits)
  return +digits.join('')
}

const f1 = input => {
  const lines = input.split("\r\n")
  const outputs = lines.map(line => line.split(' | ')[1].split(' '))
  return outputs.reduce((sum, output) => {
    return sum + output
      .filter(val => [2, 3, 4, 7].includes(val.length))
      .length
  }, 0)
}

// const minimalTestInput = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`
const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

// console.assert(f1(testInput) === 26, 'part 1 fails')
// console.assert(f2(minimalTestInput) === 5353, 'part 2 fails')
console.assert(f2(testInput) === 61229, 'part 2 fails')
// console.log(f1(input))
console.log(f2(input))