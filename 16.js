const fs = require('fs')

const day = 16;

let logEnabled = true

const hex2bin = hex => hex
  .split('')
  .map(i => parseInt(i, 16).toString(2).padStart(4, '0'))
  .join('')

const parsePackage = bin => {
  log('> Parse package from tape', bin)
  logDepth++
  try {
    const tape = bin.split('').map(v => +v)

    const version = parseInt(extractFromTape('package version', 3, tape).join(''), 2)
    const type = parseInt(extractFromTape('package type', 3, tape).join(''), 2)

    let content, rest
    if (type === 4) {
      log('= start processing literal value groups', tape.join(''))
      let binContent = '', hasNextGroup, group
      do {
        try {
          [hasNextGroup, ...group] = extractFromTape('literal value group', 5, tape)
          log('== found group', hasNextGroup, group.join(''), tape.join(''))
        } catch (error) {
          log('== error', error, tape.join(''))
          hasNextGroup = false
          group = []
        }
        binContent += group.join('')
      } while (hasNextGroup);

      content = parseInt(binContent, 2)
      rest = tape.join('')
      log('= finished processing literal value groups', tape.join(''))
    } else {
      const [lengthTypeId] = extractFromTape('length type id', 1, tape)
      let groupLimitValue
      if (lengthTypeId === 0) {
        groupLimitValue = parseInt(extractFromTape('length type total length', 15, tape).join(''), 2)
      } else {
        groupLimitValue = parseInt(extractFromTape('length type total package number', 11, tape).join(''), 2)
      }
      [content, rest] = getPackages(tape.join(''), {type: lengthTypeId, value: groupLimitValue})
    }
    const package = {
      version,
      type,
      content
    }
    logDepth--
    log('< Found package', print(package), rest)
    return [package, rest]
  } catch (error) {
    logDepth--
    log('<! Got error during parsing package', error)
    return [null, bin]
  }
}

const getPackages = (bin, packageLimit) => {
  log('> Get subpackages', bin, print(packageLimit))
  logDepth++
  let packages = []
  let rest = bin
  let package, newRest, totalLengthOfProcessedPackages = 0
  do {
    [package, newRest] = parsePackage(rest)
    if (package) {
      totalLengthOfProcessedPackages += rest.length - newRest.length
      if (packageLimit) {
        if (packageLimit.type === 0) {
          if (totalLengthOfProcessedPackages > packageLimit.value) {
            log('= would exceed package limit by bin size, forget last package', `${totalLengthOfProcessedPackages} > ${packageLimit.value}`)
            break;
          }
        } else {
          if (packages.length >= packageLimit.value) {
            log('= would exceed package limit by package number, forget last package', `${packages.length} > ${packageLimit.value}`)
            break;
          }
        }
      }
      packages.push(package)
      rest = newRest
    }
  } while (package);
  logDepth--
  log('< Got subpackages', print({numOfPackages: packages.length, rest}))
  return [packages, rest]
}

const extractFromTape = (type, length, tape) => {
  if (tape.length < length) throw 'Parse package: invalid ' + type
  return tape.splice(0, length)
}

const f1 = hex => {
  const bin = hex2bin(hex)
  const [package, _] = parsePackage(bin)
  return sumOfVersionRecursive(package)
}

const f2 = hex => {
  const bin = hex2bin(hex)
  const [package, _] = parsePackage(bin)
  // const sumOfVersion = sumOfVersionRecursive({version: 0, type: 0, content: packages})
  return calc(package.type, package.content)
}

let logDepth = 0
const log = (message, ...args) => {
  if (logEnabled) {
    process.stdout.cursorTo(logDepth)
    process.stdout.write(`${message}: ${args.join(' ')}\n`)
  }
}

const print = val => {
  if (typeof val !== 'object') {
    return val
  }
  if (Array.isArray(val)) {
    return printArr(val)
  }
  return printObj(val)
}

const printArr = arr => {
  return `[${
    arr
      .map(val => print(val))
      .join(', ')
  }]`
}

const printObj = obj => {
  return `{${
    Object.entries(obj)
      .map(([key, val]) => `${key}: ${print(val)}`)
      .join(', ')
  }}`
}

const sumOfVersionRecursive = package => {
  if (package.type === 4) {
    return package.version
  }
  const sumOfChildrenVersion = package.content.reduce((sum, package) => sum + sumOfVersionRecursive(package), 0)
  return package.version + sumOfChildrenVersion
}

const ops = {
  0: 'sum',
  1: 'prod',
  2: 'min',
  3: 'max',
  4: 'val',
  5: 'gt',
  6: 'lt',
  7: 'eq'
}
const calc = (op, content) => {
  switch (ops[op]) {
    case 'sum':
      return content.reduce((sum, obj) => sum + calc(obj.type, obj.content), 0)
    case 'prod':
      return content.reduce((prod, obj) => prod * calc(obj.type, obj.content), 1)
    case 'min':
      return Math.min(...content.map(obj => calc(obj.type, obj.content)))
    case 'max':
      return Math.max(...content.map(obj => calc(obj.type, obj.content)))
    case 'val':
      return content
    case 'gt':
      return +(calc(content[0].type, content[0].content) > calc(content[1].type, content[1].content))
    case 'lt':
      return +(calc(content[0].type, content[0].content) < calc(content[1].type, content[1].content))
    case 'eq':
      return +(calc(content[0].type, content[0].content) == calc(content[1].type, content[1].content))
  }
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8').split(`\r\n`)
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

// console.assert(f1(testInput[0]) === 16, 'part 1.1 fails')
logEnabled = false
// console.assert(f1(testInput[1]) === 12, 'part 1.2 fails')
// console.assert(f1(testInput[2]) === 23, 'part 1.3 fails')
// console.assert(f1(testInput[3]) === 31, 'part 1.4 fails')
console.assert(f2(testInput[4]) === 3, 'part 2.1 fails')
console.assert(f2(testInput[5]) === 54, 'part 2.2 fails')
console.assert(f2(testInput[6]) === 7, 'part 2.3 fails')
console.assert(f2(testInput[7]) === 9, 'part 2.4 fails')
console.assert(f2(testInput[8]) === 1, 'part 2.5 fails')
console.assert(f2(testInput[9]) === 0, 'part 2.6 fails')
console.assert(f2(testInput[10]) === 0, 'part 2.7 fails')
console.assert(f2(testInput[11]) === 1, 'part 2.8 fails')
// console.log(f1(input))
console.log(f2(input))