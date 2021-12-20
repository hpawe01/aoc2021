const fs = require('fs')

const day = 18;

const f1 = input => {
  const snailNums = input.split("\r\n").map(l => parseSnailNum(l))
  const result = snailNums.reduce((res, snailNum) => snailAdd(res, snailNum), null)
  const magnitude = calcMagnitude(result)
  return magnitude
}

const snailCopy = snailNum => parseSnailNum(printSnailNum(snailNum))

const f2 = input => {
  const snailNums = input.split("\r\n").map(l => parseSnailNum(l))
  // console.log(calcMagnitude(snailAdd(snailNums[8], snailNums[0])))
  let maxMagnitude = 0
  for (let i = 0; i < snailNums.length; i++) {
    for (let j = i + 1; j < snailNums.length; j++) {
      // console.log(
      //   i,
      //   j,
      //   maxMagnitude,
      //   calcMagnitude(snailAdd(snailNums[i], snailNums[j])),
      //   calcMagnitude(snailAdd(snailNums[j], snailNums[i])))
      maxMagnitude = Math.max(
        maxMagnitude,
        calcMagnitude(snailAdd(snailCopy(snailNums[i]), snailCopy(snailNums[j]))),
        calcMagnitude(snailAdd(snailCopy(snailNums[j]), snailCopy(snailNums[i])))
      )
    }
  }
  console.log(maxMagnitude)
  return maxMagnitude
}

const parseSnailNum = str => {
  let parts = str.split('')

  let nextPart, currentParent
  while (parts.length > 0) {
    [nextPart, ...parts] = parts
    switch (nextPart) {
      case '[':
        nextNode = {children: []}
        if (currentParent) {
          currentParent.children.push(nextNode)
          nextNode.parent = currentParent
        }
        currentParent = nextNode
        break;
      case ']':
        if (currentParent.parent) {
          currentParent = currentParent.parent
        }
        break;
      case ',':
        break;

      default:
        currentParent.children.push({val: +nextPart, parent: currentParent})
        break;
    }
  }
  return currentParent
}

const printSnailNum = snailNum => {
  if (!snailNum.children) {
    return snailNum.val
  }
  return `[${printSnailNum(snailNum.children[0])},${printSnailNum(snailNum.children[1])}]`
}

const snailAdd = (num1, num2) => {
  if (!num1) {
    return num2
  }
  // 1 create new root
  const newNum = {
    children: [num1, num2]
  }
  num1.parent = newNum
  num2.parent = newNum
  // 2 do steps until nothing
  let didExplode, performedSplit
  do {
    didExplode = explodeRecursive(newNum, 1, false)
    // console.log('after explode', printSnailNum(newNum));
    performedSplit = doSplit(newNum, false)
    // console.log('after split', printSnailNum(newNum));
  } while (performedSplit);
  return newNum
}

const explodeRecursive = (snailNum, depth, didExplode) => {
  if (!snailNum.children) {
    return false
  }
  if (depth <= 4) {
    explodeRecursive(snailNum.children[0], depth + 1, didExplode)
    explodeRecursive(snailNum.children[1], depth + 1, didExplode)
    return false
  }
  // console.log('add to first left neighbour', snailNum.children[0], getFirstNodeAtChildPosition(snailNum, 1))

  const parentWithLeftNeighbour = getFirstNodeAtChildPosition(snailNum, 1)
  if (parentWithLeftNeighbour) {
    addToLeaveAtChildPosition(parentWithLeftNeighbour.children[0], 1, snailNum.children[0].val)
  }
  const parentWithRightNeighbour = getFirstNodeAtChildPosition(snailNum, 0)
  if (parentWithRightNeighbour) {
    // console.log('add to first right neighbour', snailNum.children[1], parentWithRightNeighbour)
    addToLeaveAtChildPosition(parentWithRightNeighbour.children[1], 0, snailNum.children[1].val)
  }
  snailNum.val = 0
  snailNum.children = null
  return true
}

const getFirstNodeAtChildPosition = (snailNum, childPosition) => {
  // console.log('getFirstNodeAtChildPosition', snailNum.parent, childPosition)
  if (!snailNum.parent) return
  if (snailNum.parent.children.indexOf(snailNum) === childPosition) return snailNum.parent
  return getFirstNodeAtChildPosition(snailNum.parent, childPosition)
}

const addToLeaveAtChildPosition = (snailNum, childPosition, val) => {
  if (!snailNum) {
    return
  }
  if (snailNum.children) {
    addToLeaveAtChildPosition(snailNum.children[childPosition], childPosition, val)
  } else {
    snailNum.val += val
  }
}

const doSplit = (snailNum, performedSplit) => {
  if (snailNum.children) {
    let i = 0
    do {
      performedSplit = doSplit(snailNum.children[i++], performedSplit)
    } while (!performedSplit && i < snailNum.children.length)
    return performedSplit
  }
  if (snailNum.val < 10) {
    return false
  }
  snailNum.children = [
    {parent: snailNum, val: Math.floor(snailNum.val / 2)},
    {parent: snailNum, val: Math.ceil(snailNum.val / 2)}
  ]
  snailNum.val = null
  // console.log('after split', snailNum)
  return true
}

const calcMagnitude = snailNum => {
  if (!snailNum.children) {
    return snailNum.val
  }
  return calcMagnitude(snailNum.children[0]) * 3 + calcMagnitude(snailNum.children[1]) * 2
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')


// const snailNum = snailAdd(parseSnailNum('[[[[4,3],4],4],[7,[[8,4],9]]]'), parseSnailNum('[1,1]'))
// const snailNum = parseSnailNum('[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]')
// explodeRecursive(snailNum, 1)
// console.log(printSnailNum(snailNum))

// console.log(printSnailNum(parseSnailNum('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')))
// console.assert(calcMagnitude(parseSnailNum('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')) === 1384, 'magnitude fails')
// console.assert(f1(testInput) === 4140, 'part 1 fails')
console.assert(f2(testInput) === 3993, 'part 2 fails')
// console.log(f1(input))
console.log(f2(input))