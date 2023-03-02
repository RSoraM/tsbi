import { expect, describe, it } from 'vitest'
import { add } from '../dist/index.cjs'

describe('add', () => {
  it('number + number', () => {
    expect(add(1, 2)).toBe(3)
  })
  it('string + number', () => {
    expect(add('1', 2)).toBe(3)
  })
  it('null + number', () => {
    expect(add(null, 2)).toBe(2)
  })
  it('undefined + number', () => {
    expect(add(undefined, 2)).toBe(NaN)
  })
})
