import { describe, expect, it } from 'vitest'
import { generateAnswer } from './ai'

describe('generateAnswer', () => {
  it('answers greeting questions', () => {
    expect(generateAnswer('hello')).toContain('Hello')
  })

  it('explains React clearly', () => {
    expect(generateAnswer('what is react')).toContain('JavaScript library')
  })

  it('returns a fallback for unknown questions', () => {
    expect(generateAnswer('How do I build a business?')).toContain('best next step')
  })
})
