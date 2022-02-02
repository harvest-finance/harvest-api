const assert = require('chai').assert
const { gte, gt, isFinite } = require('lodash')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function assertValidPositiveNumber(s) {
  const n = Number(s)
  assert.isTrue(isFinite(n), `Number ${n} is not finite`)
  assert.isTrue(gt(n, 0), `Number ${n} is not positive`)
}

function assertValidNonNegativeNumber(s) {
  const n = Number(s)
  assert.isTrue(isFinite(n), `Number ${n} is not finite`)
  assert.isTrue(gte(n, 0), `Number ${n} is not non-negative`)
}

function assertArraySize(ar, size) {
  assert.equal(ar.length, size, `Array size mismatch: ${ar.length} vs ${size}`)
}

function assertIsDate(date) {
  return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date))
}

module.exports = {
  sleep,
  assertValidPositiveNumber,
  assertValidNonNegativeNumber,
  assertArraySize,
  assertIsDate,
}
