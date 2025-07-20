import { describe, it, expect } from 'vitest'
import { add } from '../src/index'

describe('add', () => {
  it('is a function', () => {
    expect(typeof add).toBe('function')
  })
})
