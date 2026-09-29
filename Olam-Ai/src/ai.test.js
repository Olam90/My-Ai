import { describe, expect, it } from 'vitest'
import { formatPlainText } from './ai'

describe('formatPlainText', () => {
  it('removes markdown formatting and keeps readable plain text', () => {
    const result = formatPlainText('# Title\n\n**Hello**\n- item one\n- item two\n\n[link](https://example.com)')

    expect(result).toBe('Title\n\nHello\n• item one\n• item two\n\nlink')
  })
})
