const fs = require('fs')
const math = require('mathjs')

const day = 19;

const f1 = input => {
  const scanner = parseScanner(input)
  scanner.forEach(aScanner => calcDists(aScanner))

  scanner[0].rotation = math.identity(3)
  scanner[0].position = math.matrix([0,0,0])

  const resetScanner = (scannerB) => {
    scannerB.beacons = scannerB.beacons.map(({id, dists, position}) => ({
      id,
      dists,
      position: math.add(math.multiply(math.matrix(position), scannerB.rotation), scannerB.position).toArray()
    }))
  }
  // console.log(scanner[1].beacons.map(b => b.position))
  while (scanner.filter(s => !s.position).length !== 0) {
    for (let i = 0; i < scanner.length; i++) {
      for (let j = 0; j < scanner.length; j++) {
        if (i === j) continue
        const scannerA = scanner[i]
        const scannerB = scanner[j]
        if (!scannerA.position || scannerB.position) continue
        const overlappingBeacons = getOverlappingBeacons(scannerA, scannerB)
        if (!overlappingBeacons.length) continue
        // console.log('Found match for ', i, j)
        setPositionOfScanner(overlappingBeacons, scannerB)
        resetScanner(scannerB)
      }
    }
  }

  const allBeacons = scanner
  .map(s => s.beacons.map(b => b.position))
  .reduce((arr, s) => [...arr, ...s], [])
  .reduce((obj, p) => {obj[p.join()] = true; return obj}, {})

  return Object.values(allBeacons).length
}

const f2 = input => {
  const scanner = parseScanner(input)
  scanner.forEach(aScanner => calcDists(aScanner))

  scanner[0].rotation = math.identity(3)
  scanner[0].position = math.matrix([0,0,0])

  const resetScanner = (scannerB) => {
    scannerB.beacons = scannerB.beacons.map(({id, dists, position}) => ({
      id,
      dists,
      position: math.add(math.multiply(math.matrix(position), scannerB.rotation), scannerB.position).toArray()
    }))
  }
  // console.log(scanner[1].beacons.map(b => b.position))
  while (scanner.filter(s => !s.position).length !== 0) {
    for (let i = 0; i < scanner.length; i++) {
      for (let j = 0; j < scanner.length; j++) {
        if (i === j) continue
        const scannerA = scanner[i]
        const scannerB = scanner[j]
        if (!scannerA.position || scannerB.position) continue
        const overlappingBeacons = getOverlappingBeacons(scannerA, scannerB)
        if (!overlappingBeacons.length) continue
        // console.log('Found match for ', i, j)
        setPositionOfScanner(overlappingBeacons, scannerB)
        resetScanner(scannerB)
      }
    }
  }

  let largestDist = 0;
  for (let i = 0; i < scanner.length - 1; i++) {
    for (let j = i + 1; j < scanner.length; j++) {
      const manDist = calcManDistsBetweenPoints(scanner[i].position.toArray(), scanner[j].position.toArray())
      if (manDist > largestDist) {
        largestDist = manDist
      }
    }
  }
  return largestDist
}

const parseScanner = input => {
  return input.split("\r\n\r\n")
    .map(block => block.split(`\r\n`))
    .map(([scanner, ...beaconLines], scannerIndex) => {
      // console.log(beaconLines)
      return {
      id: `s${scannerIndex}`,
      beacons: beaconLines
        .map((positionStr, beaconIndex) => ({
          id: `${scannerIndex}-${beaconIndex}`,
          dists: [],
          position: positionStr.split(',').map(v => +v),
        }))
    }})
}

const getRotationMatrices = () => {
  const chars = 'xyz'
  const rotationMatrices = {}
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (j === i) {
        continue
      }
      for (let k = 0; k < 3; k++) {
        if (k === i || k === j) {
          continue
        }
        const permuation = [i, j, k]
        const variants = [
          [1,1,1],
          [-1,1,1],
          [1,-1,1],
          [1,1,-1],
          [-1,-1,1],
          [1,-1,-1],
          [-1,1,-1],
          [-1,-1,-1]
        ]
        variants.forEach(variant => {
          const key = variant
            .map((v, l) => (v === -1 ? '-' : '') + chars[permuation[l]])
            .join()
          // console.log('variant', variant, permuation.join(''), key)
          const matrix = math.matrix(math.zeros([3,3]))
          matrix.set([0, i], variant[0])
          matrix.set([1, j], variant[1])
          matrix.set([2, k], variant[2])
          if (math.det(matrix) === 1) {
            rotationMatrices[key] = matrix
          }
        })
      }
    }
  }
  return rotationMatrices
}
const rotationMatrices = getRotationMatrices()

const calcDists = aScanner => {
  aScanner.dists = aScanner.dists || {}
  for (let i = 0; i < aScanner.beacons.length - 1; i++) {
    const beaconA = aScanner.beacons[i];
    for (let j = i + 1; j < aScanner.beacons.length; j++) {
      const beaconB = aScanner.beacons[j];
      const dist = calcDistsBetweenPoints(beaconA.position, beaconB.position)
      aScanner.dists[`${beaconA.id};${beaconB.id}`] = dist
      aScanner.dists[`${beaconB.id};${beaconA.id}`] = dist
      beaconA.dists.push([dist, beaconB.id])
      beaconB.dists.push([dist, beaconA.id])
    }
  }
}

const calcDistsBetweenPoints = ([x1, y1, z1], [x2, y2, z2]) => {
  return Math.sqrt(
    Math.pow(x2 - x1, 2) +
    Math.pow(y2 - y1, 2) +
    Math.pow(z2 - z1, 2)
  )
}

const calcManDistsBetweenPoints = ([x1, y1, z1], [x2, y2, z2]) => {
  return Math.abs(x2 - x1) +
    Math.abs(y2 - y1) +
    Math.abs(z2 - z1)
}

const getOverlappingBeacons = (scannerA, scannerB) => {
  const beaconCandidates = []
  for (const beaconB of scannerB.beacons) {
    for (const beaconA of scannerA.beacons) {
      if (intersections(beaconB.dists.map(a => a[0]), beaconA.dists.map(a => a[0])).length >= 11) {
        // console.log('found')
        beaconCandidates.push([beaconA, beaconB])
      }
    }
  }
  // TODO we propably need to check the candidates but it works for now
  return beaconCandidates
}

const intersections = (arr1, arr2) => {
  return arr1.filter(v => arr2.includes(v))
}

const setPositionOfScanner = (overlappingBeacons, scannerB) => {
  let validPoints = Object.values(rotationMatrices).map(matrix => ({rotation: matrix, point: null}))
  let currentBeaconPair
  [currentBeaconPair, ...overlappingBeacons] = overlappingBeacons
  validPoints.forEach(validPoint => {
    const pointA = math.matrix(currentBeaconPair[0].position)
    const pointB = math.matrix(currentBeaconPair[1].position)
    validPoint.point = math.subtract(pointA, math.multiply(pointB, validPoint.rotation))
  })

  while (Object.values(validPoints).length !== 1 && overlappingBeacons.length > 0) {
    [currentBeaconPair, ...overlappingBeacons] = overlappingBeacons
    validPoints = validPoints.filter(({rotation, point}) => {
      const pointA = math.matrix(currentBeaconPair[0].position)
      const pointB = math.matrix(currentBeaconPair[1].position)
      const currentSolution = math.subtract(pointA, math.multiply(pointB, rotation))
      return math.deepEqual(point, currentSolution)
    })
  }

  scannerB.position = validPoints[0].point
  scannerB.rotation = validPoints[0].rotation
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

console.assert(f1(testInput) === 79, 'part 1 fails')
console.assert(f2(testInput) === 3621, 'part 2 fails')
console.log(f1(input))
console.log(f2(input))
