const fs = require('fs')

const day = 14;

// first naive implementation
const polymerization = (remainingSteps, chain, rules) => {
  if (remainingSteps < 1) {
    return chain
  }
  const newChain = chain.reduce((arr, char, index) => {
    arr.push(char)
    if (index < chain.length - 1) {
      const newChar = rules[`${char}${chain[index + 1]}`]
      if (newChar) {
        arr.push(newChar)
      }
    }
    return arr
  }, [])
  return polymerization(remainingSteps - 1, newChain, rules)
}

const f1 = (input, steps) => {
  const [template,_,...rawRules] = input.split("\r\n")
  const rules = rawRules.reduce((obj, rule) => {
    const [pair, char] = rule.split(' -> ')
    obj[pair] = char
    return obj
  }, {})
  const result = polymerization(steps, template.split(''), rules)
  const groupedResult = result.reduce((obj, char) => {
    obj[char] = (obj[char] || 0) + 1
    return obj
  }, {})
  return Math.max(...Object.values(groupedResult)) - Math.min(...Object.values(groupedResult))
}

// optimized implementation
const mergeGroups = (g1, g2) => {
  return [...Object.keys(g1), ...Object.keys(g2)].reduce((obj, key) => {
    obj[key] = (g1[key] || 0) + (g2[key] || 0)
    return obj
  }, {})
}

const groupByVal = arr => {
  return arr.reduce((obj, char) => {
    obj[char] = (obj[char] || 0) + 1
    return obj
  }, {})
}

const getGroupResultOfPair = (pair, depth, rules, cache) => {
  if (cache[`${pair}-${depth}`]) {
    return {...cache[`${pair}-${depth}`]}
  }
  let group
  if (depth === 0 || !rules[pair]) {
    group = groupByVal(pair.split(''))
  } else {
    const pair1 = [pair[0], rules[pair]].join('')
    const pair2 = [rules[pair], pair[1]].join('')
    group = mergeGroups(
      getGroupResultOfPair(pair1, depth - 1, rules, cache),
      getGroupResultOfPair(pair2, depth - 1, rules, cache)
    )
    group[rules[pair]]--
  }
  cache[`${pair}-${depth}`] = {...group}
  return group
}

const f2 = (input, steps) => {
  const [template,_,...rawRules] = input.split("\r\n")
  const rules = rawRules.reduce((obj, rule) => {
    const [pair, char] = rule.split(' -> ')
    obj[pair] = char
    return obj
  }, {})
  const cache = []
  const chain = template.split('');
  const pairs = chain
    .slice(0, -1)
    .map((char, index) => `${char}${chain[index + 1]}`)


  const pairGroups = pairs
    .map((pair, index) => {
      const groupAfterSteps = getGroupResultOfPair(pair, steps, rules, cache)
      if (index < pairs.length - 1) {
        groupAfterSteps[pair[1]]--
      }
      return groupAfterSteps
    })

  const groupedPairGroups = pairGroups
    .reduce((obj, pairGroup) => mergeGroups(obj, pairGroup), {})
  return Math.max(...Object.values(groupedPairGroups)) - Math.min(...Object.values(groupedPairGroups))
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

console.assert(f1(testInput, 10) === 1588, 'part 1 fails')
console.assert(f2(testInput, 40) === 2188189693529, 'part 2 fails')
console.log(f1(input, 10))
console.log(f2(input, 40))