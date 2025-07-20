import { describe, it, expect } from 'vitest'
import { reduce } from '../src/index'

describe('reduce', () => {
  it('is a function', () => {
    expect(typeof reduce).toBe('function')
  })
})
