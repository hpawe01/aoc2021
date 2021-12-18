const fs = require('fs')

const day = 17;

function gaußSum(num) {
  return (num * (num + 1)) / 2
}

const f1 = input => {
  const [_, lx, ux, uy, ly] = input.match(/target area: x=([0-9]+)\.\.([0-9]+), y=(-[0-9]+)\.\.(-[0-9]+)/)
  const targetArea = [[+lx, +ux], [+ly, +uy]]
  const [vx, vy] = findBest(targetArea)
  return gaußSum(vy)
}
const f2 = input => {
  const [_, lx, ux, uy, ly] = input.match(/target area: x=([0-9]+)\.\.([0-9]+), y=(-[0-9]+)\.\.(-[0-9]+)/)
  const targetArea = [[+lx, +ux], [+ly, +uy]]
  const values = findAll(targetArea)
  return values.length
}

const minVxFn = ([lx, ux]) => Math.ceil(-0.5 + Math.sqrt(.25 + 2*lx))
const maxVxFn = ([lx, ux]) => ux

const xFnDef = vx => {
  const upperBoundary = Math.pow(vx, 2) - gaußSum(vx - 1)
  return n => n > vx ? upperBoundary : n * vx - gaußSum(n - 1)
}
const yFnDef = vy => n => vy * n - ((Math.pow(n, 2) - n) / 2)

let logEnabled = false
const log = (str, ...args) => logEnabled && console.log(str, ...args)

const findBest = ([bx, by]) => {
  const minVx = minVxFn(bx), maxVx = maxVxFn(bx), minVy = 0, maxVy = Math.abs(by[1])

  console.log('findBest',{minVx, maxVx, minVy, maxVy})

  let xFn, yFn, found
  let vy = maxVy
  do {
    yFn = yFnDef(vy)
    let vx = minVx
    do {
      xFn = xFnDef(vx)
      log('check', {vx, vy})
      let x, y, s = 1
      do {
        [x, y] = [xFn(s), yFn(s)]
        log(' > step ', s, {x,y})
        if (x >= bx[0] && x <= bx[1] && y <= by[0] && y >= by[1]) {
          log(' == found', {vx, vy})
          found = [vx, vy]
        }
        s++
      } while (x <= bx[1] && y >= by[1] && !found);
      vx++
    } while (vx <= maxVx && !found);
    vy--;
  } while (vy >= minVy && !found);
  return found
}


const findAll = ([bx, by]) => {
  const minVx = minVxFn(bx), maxVx = maxVxFn(bx), minVy = by[1], maxVy = Math.abs(by[1])

  let xFn, yFn, all = {}
  let vy = maxVy
  do {
    yFn = yFnDef(vy)
    let vx = minVx
    do {
      xFn = xFnDef(vx)
      log('check', {vx, vy})
      let x, y, s = 1, found = false
      do {
        [x, y] = [xFn(s), yFn(s)]
        log(' > step ', s, {x,y})
        if (x >= bx[0] && x <= bx[1] && y <= by[0] && y >= by[1]) {
          log(' == found', {vx, vy})
          found = true
          all[`${vx},${vy}`] = true
        }
        s++
      } while (x <= bx[1] && y >= by[1] && !found);
      vx++
    } while (vx <= maxVx);
    vy--;
  } while (vy >= minVy);
  return Object.keys(all)
}

const testInput = fs.readFileSync(`./${day}-test-input.txt`, 'utf8')
const input = fs.readFileSync(`./${day}-input.txt`, 'utf8')

// console.log([1,2,3,4,5].map(v => xFnDef(6)(v)))
console.assert(f1(testInput) === 45, 'part 1 fails')
console.assert(f2(testInput) === 112, 'part 2 fails')
// console.log(f1(input))
console.log(f2(input))